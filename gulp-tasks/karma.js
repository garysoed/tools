var config = require('./config');
var path = require('path');

var KarmaTasks = function(karma) {
  this.karma_ = karma;
};

KarmaTasks.prototype.once = function(gulp, dir, opt_additionalFiles) {
  var files = opt_additionalFiles || [];
  files.push({
    pattern: path.join(config.DIR_OUT, dir, '*_test_pack.js'),
    included: true
  });
  return function runTests_(done) {
    new this.karma_({
      configFile: path.resolve('./karma.conf.js'),
      files: files,
      reporters: ['story'],
      storyReporter: {
        showSkipped:        true, // default: false
        showSkippedSummary: true  // default: false
      },
      singleRun: true
    }, done).start();
  }.bind(this);
};

KarmaTasks.prototype.watch = function(gulp, dir, opt_additionalFiles) {
  var files = opt_additionalFiles || [];
  files.push({
    pattern: path.join(config.DIR_OUT, dir, '*_test_pack.js'),
    included: true
  });
  return function(done) {
    new this.karma_({
      configFile: path.resolve('./karma.conf.js'),
      files: files,
      singleRun: false
    }, done).start();
  }.bind(this);
};

/**
 * @param {karma.Server} karma
 */
module.exports = function(karma) {
  return new KarmaTasks(karma);
};
