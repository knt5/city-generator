const gulp = require('gulp');
const buildJs = require('../modules/build-js');
const buildCss = require('../modules/build-css');
const buildHtml = require('../modules/build-html');

gulp.task('build:js', function(done) {
	buildJs(done);
});

gulp.task('build:css', function() {
	return buildCss();
});

gulp.task('build:html', ['build:js', 'build:css'], function(done) {
	buildHtml(done);
});

gulp.task('build', [
	'build:html'
]);
