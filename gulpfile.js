// Initialize required modules - destructured)
const { src, dest, watch, series, parallel } = require('gulp');
// Import all required packages
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const del = require('del');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');

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

function htmlTask(cb) {
  // prettier-ignore
  return src('app/*html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(dest('dist/'));
  cb();
  /* .pipe(browserSync.stream()); */
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

function watchTask() {
  watch(['app/*.html', 'app/**/*.js'], series(htmlTask, browserSyncReload));
  // prettier-ignore
  watch('app/sass/**/*.scss', scssTask);
}

function cleanTask(cb) {
  del('dist/');
  cb();
}

// prettier-ignore
exports.default = series(
    cleanTask,
    parallel(scssTask,htmlTask) ,
    browserSyncServe,
    watchTask,
);
