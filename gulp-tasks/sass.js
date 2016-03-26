var config = require('./config');
var path = require('path');

var SassTasks = function(concat, sass) {
  this.concat_ = concat;
  this.sass_ = sass;
};

SassTasks.prototype.compile = function(gulp, dir) {
  return function compileSass_() {
    return gulp.src([path.join(dir, '*.scss')])
        .pipe(this.sass_())
        .pipe(this.concat_('css.css'))
        .pipe(gulp.dest('out'));
  }.bind(this);
};

/**
 * @param {gulp-concat} concat
 * @param {gulp-sass} sass
 */
module.exports = function(concat, sass) {
  return new SassTasks(concat, sass);
};
