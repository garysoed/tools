var config = require('./config');
var path = require('path');

var PackTasks = function(named, sourcemaps, webpack) {
  this.named_ = named;
  this.sourcemaps_ = sourcemaps;
  this.webpack_ = webpack;
};

PackTasks.prototype.app = function(gulp, rootFile) {
  return function app_() {
    return gulp.src([path.join(config.DIR_OUT, config.DIR_SRC, rootFile)])
        .pipe(this.sourcemaps_.init())
        .pipe(this.webpack_({
          output: {
            filename: 'js.js'
          }
        }))
        .pipe(this.sourcemaps_.write('./', { includeContent: true }))
        .pipe(gulp.dest('out'));
  }.bind(this);
};

PackTasks.prototype.tests = function(gulp, namespace) {
  return function compileTest_() {
    var srcs = [path.join(config.DIR_OUT, namespace, config.JS_TEST_REGEX)];
    return gulp.src(srcs)
        .pipe(this.named_(function(file) {
          var filepath = file.path;
          return path.join(
              path.dirname(filepath),
              path.basename(filepath, path.extname(filepath)) + config.PACK_SUFFIX);
        }))
        .pipe(this.sourcemaps_.init())
        .pipe(this.webpack_())
        .pipe(this.sourcemaps_.write('./', { includeContent: true }))
        .pipe(gulp.dest('.'));
  }.bind(this);
};

/**
 * @param {vinyl-named} named
 * @param {gulp-sourcemaps} sourcemaps
 * @param {gulp-webpack} webpack
 */
module.exports = function(named, sourcemaps, webpack) {
  return new PackTasks(named, sourcemaps, webpack);
};
