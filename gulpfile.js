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
    .pipe(dest('dist')); // put final CSS in dist folder
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
    .pipe(dest('dist'));
}

//
//

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask() {
  watch(
    [files.scssPath, files.jsPath],
    // prettier-ignore
    parallel(scssTask, jsTask)
  );
}

//
// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
// prettier-ignore
exports.default = series(
    parallel(scssTask, jsTask),
    watchTask
);
