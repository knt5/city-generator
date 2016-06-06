const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-ruby-sass');
const config = require('./config');

module.exports = () => {
	return sass(config.src, {
		style: 'compressed'
	})
	.on('error', sass.logError)
	.pipe(rename({
		dirname: '',
		extname: '.mustache'
	}))
	.pipe(gulp.dest(config.dest));
};
