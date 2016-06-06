const gulp = require('gulp');
const lintJs = require('../modules/lint-js');
const lintScss = require('../modules/lint-scss');
const lintHtml = require('../modules/lint-html');

gulp.task('lint:js', function() {
	lintJs();
});

gulp.task('lint:scss', function() {
	lintScss();
});

gulp.task('lint:html', function() {
	lintHtml();
});

gulp.task('lint', [
	'lint:js',
	'lint:scss',
	'lint:html'
]);
