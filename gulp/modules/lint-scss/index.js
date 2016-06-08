const gulp = require('gulp');
const plumber = require('gulp-plumber');
const scsslint = require('gulp-scss-lint');
const config = require('./config');

module.exports = () => {
	return gulp.src(config.src)
	.pipe(plumber())
	.pipe(scsslint({
		config: 'gulp/modules/lint-scss/scsslint-rules.yml'
	}));
};
