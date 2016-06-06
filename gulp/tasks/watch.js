const gulp = require('gulp');
const watchJs = require('../modules/watch-js');
const watchScss = require('../modules/watch-scss');
const watchHtml = require('../modules/watch-html');

gulp.task('watch:js', function() {
	watchJs();
});

gulp.task('watch:scss', function() {
	watchScss();
});

gulp.task('watch:html', function() {
	watchHtml();
});

gulp.task('watch', [
	'watch:js',
	'watch:scss',
	'watch:html'
]);
