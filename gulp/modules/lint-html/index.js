const gulp = require('gulp');
const plumber = require('gulp-plumber');
const htmlhint = require('gulp-htmlhint');
const config = require('./config');

module.exports = () => {
	return gulp.src(config.src)
	.pipe(plumber())
	.pipe(htmlhint())
	.pipe(htmlhint.reporter());
};
