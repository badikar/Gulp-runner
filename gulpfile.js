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
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');

// Initialize server
function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: 'app',
    },
  });
  cb();
}
// Reload server
function browserSyncReload(cb) {
  browserSync.reload();
  cb();
}

// Deletes './DIST/'
function cleanTask() {
  return del('dist/');
}

function copyTask(cb) {
  // prettier-ignore
  return src(['app/css/**/*css', 'app/images/**/*', 'app/uploads/**/*'], {
    base: 'app',
    })
    .pipe(dest('dist'));
  cb();
}

// Concatenates & uglifies JS files and sends them to './DIST'
function htmlTask(cb) {
  // prettier-ignore
  return src('app/*html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(dest('dist/'));
  cb();
}
// Sass task: compiles the main.scss file into main.css
function sassTask() {
  return src('app/sass/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(
      sass.sync({
        outputStyle: 'expanded',
      })
    ) // compile SCSS to CSS
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS runs plugins
    .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
    .pipe(dest('app/css')) // put final CSS in app folder
    .pipe(browserSync.stream());
}

// Compress img files
function imgTask(cb) {
  // prettier-ignore
  return src('dist/images/*')
  /*   .pipe(newer('dist/images/*')) */
    .pipe(imagemin())
    .pipe(dest('dist/images/'));
  cb();
}

function cleanImg(cb) {
  del('dist/images/**/*');
  cb();
}

function watchTask() {
  watch(['app/*.html', 'app/**/*.js'], series(htmlTask, browserSyncReload));
  watch('app/sass/**/*.scss', series(sassTask, copyTask));
  watch('app/images/**/*', series(cleanImg, copyTask, imgTask));
}

// prettier-ignore
exports.default = series(
    cleanTask,
    copyTask,
    parallel(sassTask,htmlTask,imgTask),
    browserSyncServe,
    watchTask,
);

/* exports.clean = cleanTask;
exports.html = htmlTask;
exports.sass = sassTask;
exports.copy = copyTask;
exports.img = imgTask;
exports.watch = watchTask;
exports.cleanImg = cleanImg;
 */
