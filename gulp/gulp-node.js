var Chance = require('chance');
var path = require('path');

var CHANCE = new Chance();
var LOADED_PATHS = {};
var TASK_SUFFIXES = {};

function loadTasks_(package) {
  var pathToLoad = package + '/gulpfile';
  if (!LOADED_PATHS[pathToLoad]) {
    require(pathToLoad);
    LOADED_PATHS[pathToLoad] = true;
  }
}

/**
 * Prefixes the task name.
 * @param {string} prefix The prefix to add.
 * @param {string} taskName The task name to be prefixed.
 * @return {string} The prefixed task name.
 * @private
 */
function prefixTaskName_(prefix, taskName) {
  if (!!prefix) {
    return prefix + ':' + taskName;
  } else {
    return taskName;
  }
}

/**
 * Resolves the given task name.
 * @param {string} name Name of the task to be resolved.
 * @return {string} The globally unique task name.
 */
function resolveTaskName_(name) {
  var parts = name.split(':');
  var package = parts[0];
  var fullpackage = path.resolve(package);
  var prefix = path.relative(path.resolve(path.dirname()), fullpackage);
  var taskName = parts[1];

  if (parts.length < 2) {
    return null;
  }

  loadTasks_(fullpackage);

  var uniqueTaskName = prefixTaskName_(prefix, taskName);
  var suffix = TASK_SUFFIXES[uniqueTaskName];
  return !!suffix ? uniqueTaskName + '#' + suffix : uniqueTaskName;
}

/**
 * Normalizes the list of dependencies.
 * @param {string} dirname The directory name of the gulp node.
 * @param {Array<string|Function>} args The list of dependencies.
 * @return {Array<string|Function>} The normalized list of dependencies.
 * @private
 */
function normalizeDependencies_(dirname, args) {
  var normalizedArgs = [];
  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (typeof arg === 'string') {
      var uniqueName = resolveTaskName_(path.join(dirname, arg));
      if (!!uniqueName) {
        arg = uniqueName;
      }
    }
    normalizedArgs.push(arg);
  }
  return normalizedArgs;
}

/**
 * A gulp node.
 * @param {string} dirname Directory name for the node. This should be a relative path from the
 *    directory where the root project is.
 * @constructor
 */
gulpnode = function(dirname, gulp) {
  this.dirname_ = dirname;
  this.gulp_ = gulp;
  this.taskSuffixes_ = {};
};

/**
 * @override gulp.dest
 */
gulpnode.prototype.dest = function() {
  return this.gulp_.dest.apply(this.gulp_, arguments);
};

/**
 * Creates an executable task.
 * @param {string} name Name of the task.
 * @param {Array<string|Function>} dependencies The dependencies for the task.
 * @return {Function}
 */
gulpnode.prototype.exec = function(name, dependencies) {
  var prefix = path.relative(path.resolve(path.dirname()), this.dirname_);
  var uniqueName = prefixTaskName_(prefix, name);
  var task = this.gulp_.task(uniqueName, dependencies);
  return task;
};

gulpnode.prototype.load = function(name) {
  loadTasks_(path.resolve(name));
};

/**
 * @override gulp.parallel
 */
gulpnode.prototype.parallel = function() {
  return this.gulp_.parallel.apply(this.gulp_, normalizeDependencies_(this.dirname_, arguments));
};

/**
 * @override gulp.series
 */
gulpnode.prototype.series = function() {
  return this.gulp_.series.apply(this.gulp_, normalizeDependencies_(this.dirname_, arguments));
};

/**
 * @override gulp.src
 */
gulpnode.prototype.src = function() {
  return this.gulp_.src.apply(this.gulp_, arguments);
};

/**
 * Creates an non executable task.
 * @param {string} name Name of the task.
 * @param {Array<string|Function>} dependencies The dependencies for the task.
 * @return {Function}
 */
gulpnode.prototype.task = function(name, dependencies) {
  var prefix = path.relative(path.resolve(path.dirname()), this.dirname_);
  var uniqueName = prefixTaskName_(prefix, name);

  var suffix = CHANCE.guid();
  TASK_SUFFIXES[uniqueName] = suffix;

  return this.gulp_.task(uniqueName + '#' + suffix, dependencies);
};

/**
 * @override gulp.watch
 */
gulpnode.prototype.watch = function(watchexpr, fn) {
  return this.gulp_.watch(watchexpr, fn);
};

module.exports = function(dirname, gulp) {
  return new gulpnode(dirname, gulp);
};
