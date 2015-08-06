'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var bs = require('browser-sync').create();
var browserify = require('gulp-browserify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-minify-css');
var reload = bs.reload;

// define paths to app files
var paths = {
  dist: 'client/dist',
  scripts: ['client/src/**/*.js'],
  app: ['client/src/app.js'],
  html: ['client/**/*.html'],
  scss: ['client/src/**/*.scss'],
  styles: ['client/lib/normalize.css/normalize.css', 'client/lib/angular-material/angular-material.css', 'client/src/style.css']
};

gulp.task('js', function() {
  return gulp.src(paths.app)
    .pipe(browserify({
      debug: true
    }))
    .pipe(gulp.dest(paths.dist))
    .pipe(bs.stream());
});

gulp.task('scss', function() {
  return gulp.src('client/src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: [
        'last 2 versions',
        'safari 5',
        'ie 8',
        'ie 9',
        'android 4'
      ]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('client/src'));
});

gulp.task('css', function() {
  return gulp.src(paths.styles)
    .pipe(concat('style.css'))
    .pipe(cssmin())
    .pipe(gulp.dest(paths.dist))
    .pipe(bs.stream());
});

gulp.task('watch', function() {
  gulp.watch(paths.html).on('change', reload);
  gulp.watch(paths.scripts, ['js']);
  gulp.watch(paths.scss,['scss']);
  gulp.watch(paths.styles,['css']);
});

gulp.task('browser-sync', function() {
  bs.init({
      proxy: "localhost:8000"
  });
});

// start node server using nodemon
gulp.task('serve', function() {
  nodemon({ script: 'index.js', ignore: 'node_modules/**/*.js'});
});

// default task call 'start', which calls serve
gulp.task('default', ['serve', 'browser-sync', 'js', 'scss', 'css', 'watch']);