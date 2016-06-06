const gulp = require('gulp');
const lint = require('../lint-html/config');
const build = require('../build-html/config');

module.exports = () => {
	gulp.watch(lint.src, ['lint:html']);
	gulp.watch(build.watchSrc, ['build:html']);
};
