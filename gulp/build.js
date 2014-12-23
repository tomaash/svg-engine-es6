'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('styles', ['wiredep', 'injector:css:preprocessor'], function () {
  return gulp.src(['src/app/index.less', 'src/app/vendor.less'])
    .pipe($.less({
      paths: [
        'src/bower_components',
        'src/app',
        'src/components'
      ]
    }))
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe($.autoprefixer())
    .pipe(gulp.dest('.tmp/app/'));
});

gulp.task('injector:css:preprocessor', function () {
  return gulp.src('src/app/index.less')
    .pipe($.inject(gulp.src([
        'src/{app,components}/**/*.less',
        '!src/app/index.less',
        '!src/app/vendor.less' 
      ], {read: false}), {
      transform: function(filePath) {
        filePath = filePath.replace('src/app/', '');
        filePath = filePath.replace('src/components/', '../components/');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    }))
    .pipe(gulp.dest('src/app/'));
});

gulp.task('injector:css', ['styles'], function () {
  return gulp.src('src/index.html')
    .pipe($.inject(gulp.src([
        '.tmp/{app,components}/**/*.css',
        '!.tmp/app/vendor.css'
      ], {read: false}), {
      ignorePath: '.tmp',
      addRootSlash: false
    }))
    .pipe(gulp.dest('src/'));
});

gulp.task('scripts', function () {
  return gulp.src('src/{app,components}/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.sourcemaps.init())
    .pipe($['6to5']())
    .pipe($.sourcemaps.write())
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('.tmp/6to5'))
    .pipe($.size());
});

gulp.task('browserify', ['scripts'], function () {
  return gulp.src('.tmp/6to5/app/index.js', { read: false })
    .pipe($.browserify({
      debug:!gulp.env.production
    }))
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('.tmp/app'))
    .pipe($.size());
});

gulp.task('injector:js', ['browserify', 'injector:css'], function () {
  return gulp.src('src/index.html')
    .pipe($.inject(gulp.src([
      '.tmp/{app,components}/**/*.js',
      '!src/{app,components}/**/*.spec.js',
      '!src/{app,components}/**/*.mock.js'
    ]), {
      ignorePath: '.tmp',
      addRootSlash: false
    }))
    .pipe(gulp.dest('src/'));
});

gulp.task('partials', function () {
  return gulp.src('src/{app,components}/**/*.html')
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'svgEngine'
    }))
    .pipe(gulp.dest('.tmp/inject/'));
});

gulp.task('html', ['wiredep', 'injector:css', 'injector:js', 'partials'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src('src/*.html')
    .pipe($.inject(gulp.src('.tmp/inject/templateCacheHtml.js', {read: false}), {
      starttag: '<!-- inject:partials -->',
      ignorePath: '.tmp',
      addRootSlash: false
    }))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    // Turn off mangling for now, not compatible with ES6
    // .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense, mangle:false}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.replace('bower_components/bootstrap/fonts','fonts'))
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest('dist/'))
    .pipe($.size({ title: 'dist/', showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src('src/assets/images/**/*')
    // Imagemin cannot be installed on heroku - skip
    // .pipe($.imagemin({
    //   optimizationLevel: 3,
    //   progressive: true,
    //   interlaced: true
    // }))
    .pipe(gulp.dest('dist/assets/images/'));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('balfour-fonts', function () {
  return gulp.src('src/assets/fonts/**')
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe($.size());
});

gulp.task('misc', function () {
  return gulp.src('src/**/*.ico')
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function (done) {
  $.del(['dist/', '.tmp/'], done);
});

gulp.task('build', ['html', 'images', 'fonts', 'balfour-fonts', 'misc']);