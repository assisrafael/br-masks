var gulp = require('gulp'),
	path = require('path'),
	jshintReporter = require('jshint-stylish'),
	plugins = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	});

var path = {
	src: {
		files: 'src/**/*.js'
	},
	test: {
		files: 'test/**/*.test.js'
	}
}

gulp.task('build', function(done) {
	var pkg = require('./package.json');

	var header = ['/**',
		' * <%= pkg.name %>',
		' * <%= pkg.description %>',
		' * @version v<%= pkg.version %>',
		' * @link <%= pkg.homepage %>',
		' * @license <%= pkg.license %>',
		' */',
		'(function () {',
		'  var root = this;',
		''].join('\n');

	var footer = ['',
		'var BrM = {',
		'   ie: IE,',
		'   cpf: CPF,',
		'   cnpj: CNPJ,',
		'   phone: PHONE,',
		'   cep: CEP,',
		'   finance: FINANCE,',
		'   nfeAccessKey: NFEACCESSKEY',
		'};',
		'var objectTypes = {',
		'	\'function\': true,',
		'	\'object\': true',
		'};',
		'if (objectTypes[typeof module]) {',
		'	module.exports = BrM;',
		'} else {',
		'	root.BrM = BrM;',
		'}',
		'}.call(this));'].join('\n');

	gulp.src([
		'bower_components/string-mask/src/string-mask.js',
		path.src.files
	])
		.pipe(plugins.concat('br-masks.js'))
		.pipe(plugins.header(header, {pkg: pkg}))
		.pipe(plugins.footer(footer))
		.pipe(plugins.concat('br-masks.js'))
		.pipe(gulp.dest('./releases'))
		.pipe(plugins.uglify())
		.pipe(plugins.concat('br-masks.min.js'))
		.pipe(gulp.dest('./releases'));

	done();
});

gulp.task('jshint', function(done) {
	gulp.src(path.src.files)
	.pipe(plugins.jshint('.jshintrc'))
	.pipe(plugins.jshint.reporter(jshintReporter));
	done();
});

gulp.task('runtestdot', function() {
	gulp.src(path.test.files, {read: false})
	.pipe(plugins.mocha({
		reporter: 'dot'
	}))
	.on('error', console.warn.bind(console));
});

gulp.task('runtest', function() {
	gulp.src(path.test.files, {read: false})
	.pipe(plugins.mocha({
		reporter: 'spec'
	}))
	.on('error', console.warn.bind(console));
});

gulp.task('default', ['jshint', 'build', 'runtestdot'], function() {
    gulp.watch(path.src.files, ['jshint', 'build', 'runtestdot']);
});

gulp.task('test', ['jshint', 'build', 'runtest']);

gulp.task('test-watch', ['jshint', 'build', 'runtest'], function() {
    gulp.watch(path.src.files, ['jshint', 'build', 'runtest']);
});
