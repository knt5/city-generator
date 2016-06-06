module.exports = {
	src: 'src/html/*.html',
	watchSrc: [
		'src/html/**/*.html',
		'src/html/**/*.mustache'
	],
	mustache: {
		dest: 'gulp/works/html/merged/'
	}
};
