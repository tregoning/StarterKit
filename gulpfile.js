// gulp packages
var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');

// config vars
var twoNewLines = '\r\n\r\n\r\n';
var cssSource = ['./css/src/style.styl'];
var cssWatch = ['./css/src/*.styl'];
var cssDestination = './css/';

// middleware
var corsMiddleware = function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
};

gulp.task('css', function() {
    gulp.src(cssSource)
        .pipe(stylus({compress: false}))
        .pipe(sourcemaps.init())
        .pipe(concat('style.css', {newLine: twoNewLines}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest(cssDestination))
        .pipe(minifyCss())
        .pipe(rename({extname: '.min.css'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(cssDestination))
        .pipe(connect.reload());
});

gulp.task('connectDev', function () {
    connect.server({
        port: process.env.WEB_PORT || 8080,
        livereload: true,
        middleware: function () {
            return [corsMiddleware];
        }
    });
});

gulp.task('watch', function () {
    gulp.watch(cssWatch, ['css']);
});

gulp.task('default', ['connectDev', 'css', 'watch']);