module.exports = {
	src: 'src/html/*.html',
	watchSrc: [
		'src/html/**/*.html',
		'src/html/**/*.mustache',
		'src/js/**/*.js',
		'src/scss/**/*.scss'
	],
	mustache: {
		dest: 'gulp/works/html/merged/'
	},
	jsDir: 'gulp/works/js/minified/'
};
