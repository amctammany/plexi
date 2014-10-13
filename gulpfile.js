'use strict';
var program = require('commander');
var chalk = require('chalk');
var express = require('express');
var path = require('path');
var rimraf = require('rimraf');
var karma = require('gulp-karma');

var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var buffer = require('gulp-buffer');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var jshint = require('gulp-jshint');
var htmlmin = require('gulp-htmlmin');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var stylish = require('jshint-stylish');
var jsdoc = require('gulp-jsdoc');



var testFiles = [
  'src/plexi.js',
  'src/core/*.js',
  'src/behaviors/*.js',
  'test/**/*.js'
];

program.on('--help', function(){
  console.log('  Tasks:');
  console.log();
  console.log('    build       build the game');
  console.log('    clean       delete generated files');
  console.log('    dist        generate archive');
  console.log('    serve       launch development server');
  console.log('    watch       watch for file changes and rebuild automatically');
  console.log();
});

program
  .usage('<task> [options]')
  .option('-P, --prod', 'generate production assets')
  .parse(process.argv);

var prod = !!program.prod;

gulp.task('default', ['build']);
gulp.task('build', ['build_source', 'build_app', 'build_index', 'build_styles']);

gulp.task('build_source', function () {
  gulp.src(['src/plexi.js', 'src/core/*.js', 'src/behaviors/*.js'])
    //.pipe(uglify())
    .pipe(concat('plexi.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('build_app', function () {
  return gulp.src('app/**/*.js')
    .pipe(gulp.dest('build'));
});
gulp.task('build_index', function() {
  return gulp.src('app/index.html')
    .pipe(gulpif(prod, htmlmin({
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true,
    })))
    .pipe(gulp.dest('build'));
});

gulp.task('build_styles', function() {
  return gulp.src('app/styles.styl')
    .pipe((stylus()))
    .pipe(concat('app.css'))
    .pipe(gulpif(prod, cssmin()))
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
  rimraf.sync('build');
  rimraf.sync('dist');
});

gulp.task('jshint', function () {
  return gulp.src(['*.js', 'src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('test', ['build_source'], function () {
  gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
    }))
    .on('error', function (err) {
      throw err;
    });
});

gulp.task('dist', ['build'], function() {
  if (!prod) {
    gutil.log(chalk.yellow('WARNING'), chalk.gray('Missing flag --prod'));
    gutil.log(chalk.yellow('WARNING'), chalk.gray('You should generate production assets to lower the archive size'));
  }

  return gulp.src('build/*')
    //.pipe(zip('archive.zip'))
    //.pipe(size())
    //.pipe(microu{limit: 13 * 1024}))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['jshint', 'build_source']);
  gulp.watch('app/**/*.js', ['build_app']);
  gulp.watch('app/styles.styl', ['build_styles']);
  gulp.watch('app/index.html', ['build_index']);
});


gulp.task('jsdoc', function () {
  rimraf.sync('./doc');
  gulp.src('src/**/*.js')
    .pipe(jsdoc('./doc'));
});

gulp.task('serve', ['build'], function() {
  require('./app').listen(3000);
});

