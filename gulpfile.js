const { src, dest, watch, series } = require('gulp');
const browserSync = require('browser-sync').create();
const autoPrefixer = require('gulp-autoprefixer');
const filrInclude = require('gulp-file-include');
const del = require('del');
const gulpIf = require  ('gulp-if')
const cssMin = require('gulp-cssmin');
const scss = require('gulp-sass')(require('sass'))
const htmlMin = require('gulp-htmlmin');
const avif = require('gulp-avif');
const webp = require('gulp-webp');


const clear = () =>{
    return del(['app'])
}

const htmlInclude = () =>{
    return src('src/**/*.html')
        .pipe(filrInclude({
            prefix: '@',
            basepath: '@file'
        }))
        .pipe(dest('app/'))
        .pipe(browserSync.stream())
}

const styles = () =>{
    return src('src/scss/**/*.scss')
        .pipe(scss().on('error', scss.logError))
        .pipe(dest('app/'))
        .pipe(browserSync.stream())
}

const scripts = () =>{
    return src('src/js/**/*.js')
        .pipe(dest('app/js/'))
        .pipe(browserSync.stream())
}

const watcher = () =>{
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })

    watch(['src/**/*.html'], htmlInclude);
    watch(['src/scss/**/*.scss'], styles);
    watch(['src/js/**/*.js'], scripts);
}

exports.default = series(clear, htmlInclude, styles, scripts, watcher);