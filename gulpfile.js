'use strict';

var
    gulp        = require('gulp'),

    path        = require('path'),

    concat      = require('gulp-concat'),

    less        = require('gulp-less'),

    gutil       = require('gulp-util'),

    ftp         = require('gulp-ftp'),

    rename      = require("gulp-rename"),

    minifyCSS   = require('gulp-minify-css'),

    compressor  = require('node-minify');




gulp.task('js-app', function()
{
    gulp.src('./js/source/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./js/'));
});

gulp.task('js-plugins', function()
{
    gulp.src('./js/plugins/*')
        .pipe(concat('app.plugins.js'))
        .pipe(gulp.dest('./js/'));
});



gulp.task('scripts', function()
{
    gulp.src(['./js/source/*.js','./js/plugins/*'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./js/'));

    // Using UglifyJS
    // https://www.npmjs.com/package/node-minify
    compressor.minify({
        compressor  : 'gcc',
        input       : ['./js/source/*.js','./js/plugins/*'],
        output      : './js/app.min.js',
        callback    : function (err, min) {}
    });

});

gulp.task('build', function() {

    gulp.run('js-app');
    gulp.run('style');
});

gulp.task('style', function () {

    gulp.src(['./css/less/*.css','./css/less/*.less','./css/plugins/*'])
        .pipe(less())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./css/'));

    gulp.src(['./css/less/*.css','./css/less/*.less','./css/plugins/*'])
        .pipe(less())
        .pipe(concat('main.css'))
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('./css/'));

});



gulp.task('watch', function()
{
    gulp.watch('./js/source/*.js', ['js-app']);
    gulp.watch('./css/less/*.less', ['style']);
});





// данные для поступа по FTP
var connect = {
    host: '********',
    user: '********',
    pass: '********'
};



var push = function(connect, from, to ) {

    connect.remotePath = to;
    gulp.src(from).pipe(ftp(connect)).pipe(gutil.noop());
};



gulp.task('push', function () {

    push(connect, './css/*.css', '/css/');
    push(connect, './css/images/*', '/css/images/');
    push(connect, './img/*', '/img/');
    push(connect, './img/*/*', '/img/');
    push(connect, './img/*/*/*', '/img/');
    push(connect, './js/*.js', '/js/');
    push(connect, './tpl/*.php', '/tpl/');
    push(connect, './index.php', '/');
    push(connect, './404.html', '/');
    push(connect, './.htaccess', '/');
    push(connect, './info.txt', '/');

    return true;
});


gulp.task('push-js', function () {

    push(connect, './js/*.js', '/js/');

    return true;
});
gulp.task('push-css', function () {

    push(connect, './css/*.css', '/css/');

    return true;
});