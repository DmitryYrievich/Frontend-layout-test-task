"use strict";
// Подключаем Gulp
let gulp = require("gulp");
const babel = require('gulp-babel');

let sass = require("gulp-sass"),
    cssnano = require("gulp-cssnano"),
    autoprefixer = require("gulp-autoprefixer"),
    imagemin = require("gulp-imagemin"),
    concat = require("gulp-concat"),
    uglify = require('gulp-uglify-es').default,
    rename = require("gulp-rename"),
    tildeImporter = require('node-sass-tilde-importer');
var browserSync = require("browser-sync").create();

gulp.task("html", function() {
    return gulp.src("src/*.html")
    .pipe(gulp.dest("dist"));
});

gulp.task("sass", function() {
    return gulp.src(["src/sass/*.sass"])
        .pipe(concat('styles.sass'))
        .pipe(sass({
          importer: tildeImporter
        }))
        .pipe(autoprefixer({
            overrideBrowserslist:  ['last 2 versions'],
            cascade: false
         }))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task("scripts", function() {
    return gulp.src("src/js/*.js")
        .pipe(concat('main.js'))
        .pipe(babel({presets: ['@babel/env']}))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("imgs", function() {
    return gulp.src("src/images/*.+(jpg|jpeg|png|gif)")
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true
        }))
        .pipe(gulp.dest("dist/images"))
});

gulp.task("watch", function() {
    gulp.watch("src/*.html", gulp.task("html"));
    // gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch("src/js/*.js", gulp.task("scripts"));
    gulp.watch("src/sass/*.sass", gulp.task("sass"));
    gulp.watch("src/images/*.+(jpg|jpeg|png|gif)", gulp.task("imgs"));
    gulp.watch("src/fonts/*.ttf", gulp.task("fonts"));
});

// Переносим шрифты
gulp.task("fonts", function() {
  return gulp.src("src/fonts/**/*")
  .pipe(gulp.dest("dist/fonts"))
})

gulp.task("serve", function() {
    browserSync.init({
        server: {
          baseDir: './dist'
        },
        notify: false
    });
  browserSync.watch('dist/').on('change', browserSync.reload);

  gulp.watch("src/sass/*.sass", gulp.series('sass'));
    gulp.watch("src/*.html").on("change", () => {
      browserSync.reload();
      done();
    });

    done();
});

// Запуск тасков по умолчанию
gulp.task("default", gulp.series("html", "sass", "scripts", "imgs", "fonts"));
