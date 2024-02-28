module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      {pattern: 'out/bundle.js', watched: true, included: true},
      {pattern: 'out/bundle.js.map', watched: true, included: false},
    ],
    exclude: [],
    preprocessors: {},
    plugins: [
      require('karma-jasmine'),
      require('karma-sourcemap-loader'),
      require('karma-chrome-launcher'),
      require('gs-testing/karma-gs-framework'),
    ],
    port: 8888,
    reporters: ['gs'],
    browsers: ['ChromeHeadless'],
    singleRun: false,
  });
};
