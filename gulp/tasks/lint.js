const gulp = require('gulp');
const lintJs = require('../modules/lint-js');
const lintScss = require('../modules/lint-scss');
const lintHtml = require('../modules/lint-html');

gulp.task('lint:js', function() {
	return lintJs();
});

gulp.task('lint:scss', function() {
	return lintScss();
});

gulp.task('lint:html', function() {
	return lintHtml();
});

gulp.task('lint', [
	'lint:js',
	'lint:scss',
	'lint:html'
]);
