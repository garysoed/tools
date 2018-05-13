module.exports = function(config) {
  config.set({
    frameworks: ["jasmine"],
    files: [
      {pattern: "dist/bundle.js", watched: true, included: true},
      {pattern: "dist/bundle.js.map", watched: true, included: false},
    ],
    exclude: [
    ],
    preprocessors: {
    },
    plugins: [
      require("../../node_modules/karma-jasmine"),
      require("../../node_modules/karma-sourcemap-loader")
    ],
    port: 8888,
    reporters: ["progress"],
    singleRun: false
  });
};
