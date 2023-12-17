const { src, dest, watch, series } = require('gulp');
const browserSync = require('browser-sync').create();
const autoPrefixer = require('gulp-autoprefixer');
const filrInclude = require('gulp-file-include');
const del = require('del');
const gulpIf = require  ('gulp-if')
const cssMin = require('gulp-cssmin');
const htmlMin = require('gulp-htmlmin');
const avif = require('gulp-avif');
const webp = require('gulp-webp');

const clear = () =>{
    return del(['app'])
}
