var config = require('./config');
var path = require('path');

var MythTasks = function(concat, myth) {
  this.concat_ = concat;
  this.myth_ = myth;
};

MythTasks.prototype.compile = function(gulp, dir) {
  return function compileMyth_() {
    return gulp.src([path.join(dir, '*.css')])
        .pipe(this.concat_('css.css'))
        .pipe(this.myth_())
        .pipe(gulp.dest('out'));
  }.bind(this);
};

/**
 * @param {gulp-concat} concat
 * @param {gulp-myth} myth
 */
module.exports = function(concat, myth) {
  return new MythTasks(concat, myth);
};
