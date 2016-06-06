const glob = require('glob');
const path = require('path');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const mustache = require('gulp-mustache');
const htmlmin = require('gulp-htmlmin');
const config = require('./config');

module.exports = (done) => {
	let count = 0;
	let filePaths;
	let name;
	
	// Glob base html
	filePaths = glob.sync(config.src);
	
	// Build html
	for (filePath of filePaths) {
		// Base name
		name = path.basename(filePath, '.html');
		
		// Mustache
		gulp.src(filePath)
		.pipe(plumber())
		.pipe(mustache({
			css: '',
			javascript: ''
		}))
		.pipe(gulp.dest(config.mustache.dest))
		.on('end', ((name) => {
			return () => {
				// Minify html
				gulp.src(config.mustache.dest + name + '.html')
				.pipe(plumber())
				.pipe(htmlmin({
					collapseWhitespace: true,
					removeComments: true
				}))
				.pipe(gulp.dest('./'))
				.on('end', () => {
					// Check done or not
					count ++;
					if (count >= filePaths.length) {
						done();
					}
				});
			};
			
		})(name));
	}
};
