var config = require('./config');
var debug = require('gulp-debug');
var path = require('path');

var TypescriptTasks = function(tslint, typescript) {
  this.tslint_ = tslint;
  this.typescript_ = typescript;
};

TypescriptTasks.prototype.compile = function(gulp) {
  return function() {
    var tsProject = this.typescript_.createProject(config.TS_CONFIG);
    return tsProject.src()
        .pipe(this.typescript_(tsProject))
        .pipe(gulp.dest(config.DIR_OUT));
  }.bind(this);
};

TypescriptTasks.prototype.lint = function(gulp, namespace) {
  return function lint_() {
    return gulp.src([path.join(config.DIR_SRC, namespace, '*.ts')])
        .pipe(this.tslint_())
        .pipe(this.tslint_.report('verbose'));
  }.bind(this);
};

/**
 * @param {gulp-tslint} tslint
 * @param {gulp-typescript} typescript
 */
module.exports = function(tslint, typescript) {
  return new TypescriptTasks(tslint, typescript);
};
