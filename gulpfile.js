var gulp = require('gulp'),
    sourcemaps = require("gulp-sourcemaps"),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    bower = require('gulp-bower'),
    swig = require('gulp-swig'),
    data = require('gulp-data'),
    browserSync = require('browser-sync').create();

var config = {
    sassDir: './sass',
    bowerDir: './bower_components',
    templateDir: './templates'
};

var getJsonData = function (fileName) {
    'use strict';
    return require(config.templateDir + '/' + fileName);
};

var opts = {
    defaults: {
        cache: false
    },
    load_json: true,
    data: {
        now: new Date()
    }
};

gulp.task('build-templates', function () {
    'use strict';
    return gulp.src([config.templateDir + '/**/*.html', '!/**/_*.html'])
        .pipe(data(getJsonData('basic.json')))
        .pipe(swig(opts))
        .pipe(gulp.dest('.'));
});

gulp.task('bower', function () {
    'use strict';
    return bower()
        .pipe(gulp.dest(config.bowerDir));
});

gulp.task('icons', function () {
    'use strict';
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
        .pipe(gulp.dest('./fonts'));
});

gulp.task('css-dev', function () {
    'use strict';
    gulp.src(config.sassDir + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                config.sassDir,
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
    'use strict';
    gulp.src(config.sassDir + '/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [
                config.sassDir,
                config.bowerDir + '/fontawesome/scss'
            ]
        })
            .on("error", notify.onError(function (error) {
                return "Error: " + error.message;
            })))
        .pipe(gulp.dest('./css/'));
});

gulp.task('watch', function () {
    'use strict';
    browserSync.init({
        server: "./"
    });
    
    gulp.watch(config.sassDir + '/**/*.scss', ['css-dev']);
    gulp.watch(config.templateDir + '/**/*.*', ['build-templates']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('default', ['bower', 'icons', 'build-templates', 'css-dev']);
gulp.task('deploy', ['icons', 'css-deploy', 'build-templates']);
