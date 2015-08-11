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
var uglify = require('gulp-uglify');
var reload = bs.reload;

// define paths to app files
var paths = {
  dist: 'client/dist',
  scripts: {
    src: 'client/src/**/*.js',
    app: 'client/src/app.js',
    libSrcs: ['client/lib/bower/angular/angular.js',
      'client/lib/bower/angular-aria/angular-aria.js',
      'client/lib/bower/angular-animate/angular-animate.js',
      'client/lib/bower/angular-material/angular-material.js',
      'client/lib/bower/angular-ui-router/release/angular-ui-router.js'],
    lib: 'client/dist/lib.js'
  },
  html: ['client/**/*.html'],
  scss: {
    srcs: 'client/src/**/*.scss',
    main: 'client/src/scss/style.scss'
  },
  styles: {
    libSrcs: ['client/lib/bower/normalize.css/normalize.css', 'client/lib/bower/angular-material/angular-material.css'],
    lib: 'client/dist/lib.css',
    main: 'client/dist/style.css'
  }
};

gulp.task('js', function() {
  return gulp.src(paths.scripts.app)
    .pipe(browserify({
      debug: true
    }))
    .pipe(gulp.dest(paths.dist))
    .pipe(bs.stream());
});

gulp.task('scss', function() {
  return gulp.src(paths.scss.main)
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
    .pipe(gulp.dest(paths.dist))
    .pipe(bs.stream());
});

gulp.task('libCSS', function() {
  return gulp.src(paths.styles.libSrcs)
    .pipe(concat('lib.css'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('libJS', function() {
  return gulp.src(paths.scripts.libSrcs)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('minAppJS', function() {
  return gulp.src(paths.scripts.app)
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('minLibJS', function() {
  return gulp.src(paths.scripts.lib)
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('minLibCSS', function() {
  return gulp.src(paths.styles.lib)
    .pipe(cssmin())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('minAppCSS', function() {
  return gulp.src(paths.styles.main)
    .pipe(cssmin())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', function() {
  gulp.watch(paths.html).on('change', reload);
  gulp.watch(paths.scripts.src, ['js']);
  gulp.watch(paths.scss.srcs,['scss']);
});

gulp.task('browser-sync', function() {
  bs.init({
      proxy: "localhost:8000"
  });
});

gulp.task('serve', function() {
  nodemon({ script: 'index.js', ignore: 'node_modules/**/*.js'});
});

gulp.task('prod', ['libCSS', 'libJS', 'js', 'scss', 'minLibJS', 'minAppJS', 'minAppCSS']);

gulp.task('default', ['libCSS', 'libJS', 'js', 'scss', 'watch', 'serve', 'browser-sync']);