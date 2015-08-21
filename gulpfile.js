/**
 * Created by Maxi on 8/21/2015.
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sass = require('gulp-sass');

gulp.task('js', function () {
    gulp.src(['js/**/app.js', 'js/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('app.concat.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('.'));

});

gulp.task('sass', function () {
    gulp.src('sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'));

});



gulp.task('watch', ['js', 'sass'], function () {
    gulp.watch('js/**/*.js', ['js']);
    gulp.watch('sass/**/*.scss', ['sass']);
});