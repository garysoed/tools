var config = require('./config');
var path = require('path');

var SassTasks = function(concat, sass, outdir) {
  this.concat_ = concat;
  this.sass_ = sass;
};

SassTasks.prototype.compile = function(gulp, dir, outdir) {
  var outdir = outdir || config.DIR_OUT;
  return function compileSass_() {
    console.log(path.join(dir, '*.scss'));
    return gulp.src([path.join(dir, '*.scss')])
        .pipe(this.sass_())
        .pipe(this.concat_('css.css'))
        .pipe(gulp.dest(outdir));
  }.bind(this);
};

/**
 * @param {gulp-concat} concat
 * @param {gulp-sass} sass
 */
module.exports = function(concat, sass) {
  return new SassTasks(concat, sass);
};
