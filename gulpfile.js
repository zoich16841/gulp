const { src, dest, watch, series } = require('gulp');
const browserSync = require('browser-sync').create();
const autoPrefixer = require('gulp-autoprefixer');
const fileInclude = require('gulp-file-include');
const del = require('del');
const gulpIf = require  ('gulp-if')
const cssMin = require('gulp-cssmin');
const sass = require('gulp-sass')(require('sass'))
const htmlMin = require('gulp-htmlmin');
const webpackStream = require('webpack-stream');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const sprites = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

let isProd = false;


const clear = () =>{
    return del(['app'])
}

const htmlInclude = () =>{
    return src('src/**/*.html')
        .pipe(fileInclude({
            prefix: '@',
            basepath: '@file'
        }))
        .pipe(gulpIf(isProd, htmlMin({
            collapseWhitespace: true
        })))
        .pipe(dest('app/'))
        .pipe(browserSync.stream())
}

const styles = () =>{
    return src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoPrefixer({
            cascade: false,
            grid: true,
            overrideBrowsersList: ['Last 5 versions']
        }))
        .pipe(gulpIf(isProd, cssMin()))
        .pipe(dest('app/'))
        .pipe(browserSync.stream())
}

const scripts = () =>{
    return src('src/js/main.js')
        .pipe(webpackStream({
          output: {
            filename: 'main.js'
          },
          mode: 'development',
          module: {
            rules: [{
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    ['@babel/preset-env', {
                      targets: "defaults"
                    }]
                  ]
                }
              }
            }]
          }
        }))
        .pipe(dest('app/js/'))
        .pipe(browserSync.stream())
}

const images = () =>{
    return src('src/img/**/*.{png, jpeg, jpg}')
        .pipe(dest('app/img'))
        .pipe(browserSync.stream())
}

const webpImages = () =>{
    return src('src/img/*.{png, jpeg, jpg}')
        .pipe(webp())
        .pipe(dest('app/img/'))
        .pipe(browserSync.stream())
}

const avifImages = () =>{
    return src('src/img/*.{png, jpeg, jpg}')
        .pipe(avif())
        .pipe(dest('app/img'))
        .pipe(browserSync.stream())
}

const svgSprites = () =>{
    return src('src/img/svg/*.svg')
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: {
          xmlMode: true
        },
      })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(sprites({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }))
    .pipe(dest('app/img/svg'))
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
    watch(['src/img/**/*.{png, jpeg, jpg}'], images)
    watch(['src/img/svg/*.svg'], svgSprites)
}

const toProd = (done) => {
    isProd = true;
    done()
}

exports.default = series(clear, htmlInclude, styles, scripts, images, webpImages, avifImages,svgSprites, watcher);
exports.build = series(toProd, clear, htmlInclude, styles, scripts, images, avifImages, webpImages, svgSprites);