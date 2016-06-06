const gulp = require('gulp');
const buildJs = require('../modules/build-js');
const buildCss = require('../modules/build-css');
const buildHtml = require('../modules/build-html');

gulp.task('build:js', function() {
	buildJs();
});

gulp.task('build:css', function() {
	buildCss();
});

gulp.task('build:html', function() {
	buildHtml();
});

gulp.task('build', [
	'build:js',
	'build:css',
	'build:html'
]);
