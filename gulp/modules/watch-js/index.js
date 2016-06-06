const gulp = require('gulp');
const lint = require('../lint-js/config');

module.exports = () => {
	gulp.watch(lint.src, ['lint:js']);
};
