'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var bs = require('browser-sync');
var reload = bs.reload;

// define paths to app files
var paths = {
  // client app js files
  scripts: ['client/app/**/*.js'],
  html: ['client/app/**/*.html', 'client/index.html'],
  style: ['client/style/style.css']
};

// changes to client-side codes will trigger browser refresh
gulp.task('start', ['serve'], function() {
  bs({
    notify: true, 
    injectChanges: true, 
    files: paths.scripts.concat(paths.html, paths.styles),
    proxy: 'localhost:8000'
  });
});

// start node server using nodemon
gulp.task('serve', function() {
  nodemon({ script: 'index.js', ignore: 'node_modules/**/*.js'});
});

// default task call 'start', which calls serve
gulp.task('default', ['start']);