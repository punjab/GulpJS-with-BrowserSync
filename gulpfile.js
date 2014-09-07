// include gulp
var gulp = require('gulp');

// include plug in
var clean = require('gulp-clean'),
		jshint = require('gulp-jshint'),
		changed = require('gulp-changed'),
		imagemin = require('gulp-imagemin'),
		minifyHTML = require('gulp-minify-html'),
		concat = require('gulp-concat'),
		stripDebug = require('gulp-strip-debug'),
		uglify = require('gulp-uglify'),
		autoprefix = require('gulp-autoprefixer'),
		minifyCSS = require('gulp-minify-css'),
		less = require('gulp-less'),
		size = require('gulp-size'),
		browserSync = require('browser-sync');

// Source Files
var lessSrc = './src/styles/*.less',
		cssSrc = './src/styles/*.css',
		cssDst = './build/styles',
		imgSrc = './src/images/**/*',
		imgDst = './build/images',
		jsSrc = './src/scripts/*.js',
		jsDst = './build/scripts',
		htmlSrc = './src/**/*.html',
		htmlDst = './build';

// clean old files from build
gulp.task('clean', function(){
	gulp.src('./build', {read: false})
			.pipe(clean());
});

// minify new images
gulp.task('imagemin', function(){
			gulp.src(imgSrc)
					.pipe(changed(imgDst))
					.pipe(imagemin())
					.pipe(gulp.dest(imgDst));
});

//jshint task
gulp.task('jshint', function(){
	gulp.src(jsSrc)
			.pipe(jshint())
			.pipe(jshint.reporter('default'));
});

// JS concat, strip, debug and minify
gulp.task('scripts', function(){
	gulp.src(['./src/scripts/myscript.js', jsSrc, './node_modules/bootstrap/dist/js/bootstrap.min.js'])
			.pipe(concat('script.js'))
			.pipe(stripDebug())
			.pipe(uglify())
			.pipe(gulp.dest(jsDst));
});

// CSS less, concat, autoprefix and minify
gulp.task('styles', function(){
	gulp.src([cssDst, lessSrc])
			.pipe(less())
			.pipe(concat('styles.css'))
			.pipe(autoprefix('last 2 versions'))
			.pipe(minifyCSS())
			.pipe(size())
			.pipe(gulp.dest(cssDst));
});

// minify new or changed html pages
gulp.task('htmlpage', function(){
	gulp.src(htmlSrc)
			.pipe(changed(htmlDst))
			.pipe(minifyHTML())
			.pipe(gulp.dest(htmlDst));
});

// gulp.task('watch', function(){

// });

gulp.task('browser-sync', function(){
	var files = [
		'./build/**/*'	
	];

	browserSync.init(files, {
		server: {
			baseDir: './build'
		}
	});
});

// default gulp task
gulp.task('default', ['imagemin', 'htmlpage', 'scripts', 'styles', 'browser-sync' ], function(){
	gulp.watch(lessSrc, ['styles']);
	gulp.watch(jsSrc, ['scripts', 'jshint']);
	gulp.watch(imgSrc, ['imagemin']);
	gulp.watch(htmlSrc, ['htmlpage']);
}); 
