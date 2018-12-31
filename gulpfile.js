const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const gutil = require('gulp-util');

var budo = require('budo')
var babelify = require('babelify')

const cssFiles = 'public/scss/**/*.?(s)css';

let css = gulp.src(cssFiles)
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('assets'));

gulp.task('watch', function(cb) {
  budo("app.js", {
  live: true,
  port: 3000,
  browserify: {
    transform: babelify
  }
  }).on('exit', cb);
  gulp.watch(cssFiles, function() {
    console.log("Compiling CSS")
    return gulp.src(cssFiles)
      .pipe(sass())
      .pipe(concat('style.css'))
      .pipe(gulp.dest('./dist'))
    });
});
