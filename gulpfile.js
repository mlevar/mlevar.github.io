var gulp = require('gulp'),
    sourcemaps = require("gulp-sourcemaps"),
    sass = require('gulp-sass'),
    notify = require("gulp-notify"),
    bower = require('gulp-bower'),
    browserSync = require('browser-sync').create();

var config = {
    sassPath: './sass',
    bowerDir: './bower_components'
};

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest(config.bowerDir));
});

gulp.task('icons', function () {
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
        .pipe(gulp.dest('./fonts'));
});

gulp.task('css-dev', function () {
    gulp.src(config.sassPath + '/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                config.sassPath,
                config.bowerDir + '/fontawesome/scss'
            ]
        })
            .on("error", notify.onError(function (error) {
                return "Error: " + error.message;
            })))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css/'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});


gulp.task('css-deploy', function () {
    gulp.src(config.sassPath + '/style.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [
                config.sassPath,
                config.bowerDir + '/fontawesome/scss'
            ]
        })
            .on("error", notify.onError(function (error) {
                return "Error: " + error.message;
            })))
        .pipe(gulp.dest('./css/'));
});

// Static server
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// Rerun the task when a file changes
gulp.task('watch', function () {
    
    browserSync.init({
        server: "./"
    });
    
    gulp.watch(config.sassPath + '/**/*.scss', ['css-dev']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('default', ['bower', 'icons', 'css-dev']);
