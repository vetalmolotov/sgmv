const gulp = require('gulp');
const concat = require('gulp-concat');
var nodeSass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');


nodeSass.compiler = require('node-sass');

const scssFiles = [
	'./src/sass/**/*.scss'
];

function sass() {
	return gulp
				.src(scssFiles)
        		.pipe(nodeSass.sync().on('error', nodeSass.logError))
        		.pipe(concat('styles.css'))
				.pipe(autoprefixer({
					browsers: ['last 2 versions'],
					cascade: false
				}))
				.pipe(cleanCSS({
        			level: 2
        		}))
				.pipe(gulp.dest('./build/css'))
				.pipe(browserSync.stream());
}

function img() {
	return gulp
		.src('./src/img/*')
		//.pipe(imagemin())
		.pipe(gulp.dest('./build/img/'));
}

function watch() {
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });
	gulp.watch('./src/sass/**/*.scss', sass);
	gulp.watch('./src/img/*', img);
	gulp.watch('./**/*.html', browserSync.reload);
}

function clean() {
	return del(['build/*']);
}


gulp.task('sass', sass);
gulp.task('img', img);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean,
							gulp.parallel(sass, img)
						));
gulp.task('dev', gulp.series('build', 'watch'));

