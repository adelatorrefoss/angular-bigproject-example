// MyApp gulpfile.js

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var argv = require('minimist')(process.argv.slice(2));
var runSequence = require("run-sequence");

var paths = {};
paths.app = "app/";
paths.build = "build/";

paths.jade = paths.app + '**/*.jade';
paths.js = paths.app + '**/*.js';
paths.vendor = ["node_modules/angular/angular.js",
                "node_modules/angular-route/angular-route.js",
                "node_modules/angular-cookies/angular-cookies.js"
               ];

paths.sass = [
  paths.app + "**/*.scss",
  "!" + paths.app + "scss/dependencies/reset.scss",
  "!" + paths.app + "scss/dependencies/fonts.scss",
];

paths.css_order = [
  paths.app + "scss/reset.css",
  paths.app + "scss/font.css",
];

paths.sassLint = [paths.app + "**/*.scss"];


// Conditionals

var isDeploy = argv["_"].indexOf("deploy") !== -1;


gulp.task("scss-compile", function() {
  return gulp.src(paths.sass)
    .pipe($.plumber())
    .pipe($.cached())
    .pipe($.insert.prepend('@import "dependencies";'))
    .pipe($.sass({
      endless:"true",
      errLogToConsole: true,
      includePaths: [
        paths.app + "scss",
      ]
    }))
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
      cascade: false
    }))
    .pipe($.remember('scss-compile'))
    .pipe($.order(paths.css_order,  { base: process.cwd() }))
    .pipe($.concat("style.css"))

  // TODO gulp-clean-css installed... use cssnano or cleanCSS? .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe($.if(isDeploy, $.cssnano()))
    .pipe(gulp.dest(paths.build));
});

gulp.task('scssLint', function() {
  gulp.src(paths.sassLint)
    .pipe($.plumber())
    .pipe($.cache($.scsslint({endless: true, sync: true, config: "lint.yml"}), {
      success: function(scsslintFile) {
        return scsslintFile.scsslint.success;
      }
    }));
});

gulp.task("styles", function(cb) {
  return runSequence("scssLint" , "scss-compile", cb);
});

gulp.task('scssLint', function() {
  gulp.src(paths.app + "scss/**/*.scss")
    .pipe($.plumber())
    .pipe($.cached('scssLint'))
    .pipe($.scssLint({ config: "lint.yml"}));
});


// Static content copy task
gulp.task("copyImages", function() {
  return gulp.src(paths.app + "graphics/*")
    .pipe(gulp.dest(paths.build + "graphics/"));
});

gulp.task("copyFonts", function() {
  return gulp.src(paths.app + "fonts/*")
    .pipe(gulp.dest(paths.build + "fonts/"));
});


gulp.task('sprites', function () {
  return gulp.src(paths.app + "graphics/**/*.svg")
    .pipe($.plumber())
    .pipe($.svgSprites(
      {
        mode: "symbols",
      }
    ))
    .pipe(gulp.dest(paths.build + "graphics/"));
});

gulp.task('vendor', function() {
  return gulp.src(paths.vendor)
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest(paths.build));
});


gulp.task('eslint', function() {
  return gulp.src([paths.js,
                   '!app/**/*.spec.js'])
    .pipe($.plumber())
    .pipe($.cached('js-eslint'))
    .pipe($.eslint({
      extends: 'eslint:recommended',
      // global variable to avoid fake errors in eslint
      "globals": {
        "angular": true,
        "console": true
      },
      "env": {
        "es6": true
      },
      "rules":{
        "no-console": 0
      }
    }))
    .pipe($.eslint.format());
});

// add jscs

// https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#use-an-options-file-1
// https://github.com/jscs-dev/gulp-jscs
gulp.task('jscs', function() {
  return gulp.src(paths.js)
    .pipe($.jscs({fix: true}))
    .pipe($.jscs.reporter())
    .pipe($.jscs.reporter('fail'))
    .pipe(gulp.dest(paths.src));
});


gulp.task('compileJS', function() {
  return gulp.src([paths.js,
                   '!app/**/*.spec.js'])
    .pipe($.plumber())
    .pipe($.cached('js'))
    .pipe($.selfExecute(null))
    .pipe($.babel())
    .pipe($.remember('js'))
    .pipe($.order([
      paths.app + "services/**/*.module.js",
      paths.app + "**/*.module.js",
      paths.app + "app.js",
      paths.app + "**/*.js"
    ],  { base: process.cwd() }))
    .pipe($.print())
    .pipe($.concat('all.js'))
    .pipe($.ngAnnotate())
    .pipe(gulp.dest(paths.build));
});

gulp.task('jade-index', function() {
  return gulp.src('index.jade')
    .pipe($.plumber())
    .pipe($.cached('jade-index'))
    .pipe($.jade({pretty: true}))
    .pipe(gulp.dest(paths.build));
});

gulp.task('templates', function() {
  var jade = gulp.src(paths.jade)
        .pipe($.plumber())
        .pipe($.cached('templates'))
        //.pipe($.jadeInheritance({basedir: paths.app}))
        .pipe($.jade({pretty: true}))
        .pipe($.angularTemplatecache({
          standalone: true
        }))
        .pipe($.remember('templates'))
        .pipe($.concat('templates.js'))
        .pipe(gulp.dest(paths.build));
});

gulp.task("watch", function() {
  gulp.watch(paths.app + 'graphics/**.*', ['copyImages']);
  gulp.watch(paths.app + 'font/**.*', ['copyFonts']);
  gulp.watch(paths.app + '**/*.scss', ['styles', 'scssLint','webserver-reload']);
  gulp.watch('index.jade', ['jade-index','webserver-reload']);
  gulp.watch(paths.jade, ['templates','webserver-reload']);
  gulp.watch(paths.js, ['eslint', 'compileJS','webserver-reload']);
  gulp.watch('gulpfile.js', ['compile','webserver-reload']);
});


gulp.task('dev-webserver', function() {
  $.connect.server({
    root: paths.build,
    livereload: true,
    fallback: paths.build + 'index.html'
  });
});


gulp.task('webserver-reload', function () {
  gulp.src(paths.build + 'templates.js')
    .pipe($.connect.reload());
});

gulp.task("compile", ["styles",
                      "copyImages",
                      "copyFonts",
                      "sprites",
                      "jade-index",
                      "templates",
                      "vendor",
                      "eslint",
                      "compileJS"
                     ]);

gulp.task("default", ["compile", "watch", "dev-webserver"]);

// Deploy task

gulp.task("deploy", ["compile"]);


// Test

var Server = require('karma').Server;

/**
 * Run test once and exit
 */
gulp.task('test', ['compile'], function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', ['compile', 'watch'], function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});
