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
/* const replace = require('gulp-replace'); */

// File paths
const files = {
  scssPath: 'app/sass/**/*.scss',
  jsPath: 'app/js/**/*.js',
};

// Sass task: compiles the style.scss file into style.css
function scssTask() {
  return src(files.scssPath)
    .pipe(plumber())
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass.sync()) // compile SCSS to CSS
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS runs plugins
    .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
    .pipe(dest('app/css')) // put final CSS in app folder
    .pipe(browserSync.stream());
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
  return src([
    files.jsPath,
    // ,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
  ])
    .pipe(plumber())
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(dest('app/dist'));
}

//
//

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask() {
  watch('app/*.html', browserSyncReload);
  watch(
    [files.scssPath, files.jsPath],
    // prettier-ignore
    series(scssTask, jsTask, browserSyncReload)
  );
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

//
// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
// prettier-ignore
exports.default = series(
    parallel(scssTask, jsTask),
    browserSyncServe,
    watchTask
);
