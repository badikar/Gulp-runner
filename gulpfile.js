// Initialize required modules - destructured)
const { src, dest, watch, series, parallel } = require('gulp');
// Import all required packages
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const del = require('del');
/* const replace = require('gulp-replace'); */

// Sass task: compiles the style.scss file into style.css
function scssTask() {
  return src('app/sass/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass.sync()) // compile SCSS to CSS
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS runs plugins
    .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
    .pipe(dest('app/css')) // put final CSS in app folder
    .pipe(browserSync.stream());
}

// JS task: concatenates and uglifies JS files to script.js
/* function jsTask() {
  return src([files.jsPath])
    .pipe(plumber())
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(dest('app/dist'));
} */

function watchTask() {
  watch(['app/*.html', 'app/**/*.js'], browserSyncReload);
  // prettier-ignore
  watch('app/sass/**/*.scss', scssTask);
}

function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: 'app',
    },
  });
  cb();
}
function browserSyncReload(cb) {
  browserSync.reload();
  cb();
}

function cleanTask(cb) {
  del('dist/');
  cb();
}

// prettier-ignore
exports.default = series(
    cleanTask,
    scssTask,
    browserSyncServe,
    watchTask
);
