const gulp = require('gulp');
const lint = require('../lint-html/config');

module.exports = () => {
	gulp.watch(lint.src, ['lint:html']);
};
