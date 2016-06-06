const gulp = require('gulp');
const lint = require('../lint-scss/config');

module.exports = () => {
	gulp.watch(lint.src, ['lint:scss']);
};
