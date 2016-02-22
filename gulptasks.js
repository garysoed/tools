var gulp = require('gulp');
var typescriptTasks = require('./gulp-tasks/typescript')(
    require('gulp-tslint'),
    require('gulp-typescript'));
var karmaTasks = require('./gulp-tasks/karma')(
    require('karma').Server);
var packTasks = require('./gulp-tasks/pack')(
    require('vinyl-named'),
    require('gulp-sourcemaps'),
    require('gulp-webpack'));

var tasks = {};
tasks.allTests = function(gt, dir) {
  var dir = 'src/' + dir;
  gt.task('_compile-test', packTasks.tests(gt, dir));

  gt.exec('compile-test', gt.series('_compile', '.:_compile-test'));
  gt.exec('lint', typescriptTasks.lint(gt, dir));
  gt.exec('test', gt.series('_compile', '.:_compile-test', karmaTasks.once(gt, dir)));
  gt.exec('karma', gt.series('_compile', '.:_compile-test', karmaTasks.watch(gt, dir)));
  gt.exec('watch-test', gt.series(
      '.:compile-test',
      function() {
        gt.watch(['src/**/*.ts'], gt.series('_compile', '.:compile-test'));
      }))
};

gulp.task('_compile', typescriptTasks.compile(gulp));

module.exports = tasks;
