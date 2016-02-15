var config = require('./config');
var path = require('path');

var KarmaTasks = function(karma) {
  this.karma_ = karma;
};

KarmaTasks.prototype.once = function(gulp, namespace) {
  return function runTests_(done) {
    new this.karma_({
      configFile: path.resolve('./karma.conf.js'),
      files: [
        {
          pattern: path.join(config.DIR_OUT, namespace, '*_test_pack.js'),
          included: true
        }
      ],
      reporters: ['story'],
      storyReporter: {
        showSkipped:        true, // default: false
        showSkippedSummary: true  // default: false
      },
      singleRun: true
    }, done).start();
  }.bind(this);
};

KarmaTasks.prototype.watch = function(gulp, namespace) {
  return function(done) {
    new this.karma_({
      configFile: path.resolve('./karma.conf.js'),
      files: [
        {
          pattern: path.join(config.DIR_OUT, namespace, '*_test_pack.js'),
          included: true
        }
      ],
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
