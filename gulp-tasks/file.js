var config = require('./config');

var FileTasks = function(concat) {
  this.concat_ = concat;
};

FileTasks.prototype.concat = function(gulp, srcs, dest) {
  return function concatFiles_() {
    return gulp.src(srcs, { 'base': '.' })
        .pipe(this.concat_(dest))
        .pipe(gulp.dest(config.DIR_OUT));
  }.bind(this);
};

FileTasks.prototype.copy = function(gulp, srcs) {
  return function copyFiles_() {
    return gulp.src(srcs, { 'base': '.' })
        .pipe(gulp.dest(config.DIR_OUT));
  }.bind(this);
};


/**
 * @param {gulp-concat} concat
 */
module.exports = function(concat) {
  return new FileTasks(concat);
};
