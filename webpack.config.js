const glob = require("glob");
const path = require('path');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const WebpackBuilder = require('dev/webpack/builder');

module.exports = (new WebpackBuilder(__dirname))
    .addEntry('entry', glob.sync('./src/**/*.test.ts'))
    .setOutput('bundle.js', '/out')
    .addTypeScript()
    .buildForDevelopment('gs-tools');
