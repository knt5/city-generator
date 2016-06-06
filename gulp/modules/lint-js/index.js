const gulp = require('gulp');
const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');
const config = require('./config');
const eslintConfig = require('./eslint-config');

module.exports = () => {
	return gulp.src(config.src)
	.pipe(plumber())
	.pipe(eslint(eslintConfig))
	.pipe(eslint.format())
	.pipe(eslint.failAfterError());
};
