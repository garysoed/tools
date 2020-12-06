const webpackBuilder = require('dev/webpack/builder');
const glob = require('glob');

module.exports = webpackBuilder(__dirname)
    .forDevelopment('main', builder => builder
        .addEntry('entry', glob.sync('./src/**/*.test.ts'))
        .setOutput('bundle.js', '/out')
        .addTypeScript(),
    )
    .forDevelopment('docs', builder => builder
        .addEntry('docs', ['./docassets/index.ts'])
        .setOutput('index.js', '/out')
        .setSingleRun(true)
        .addTypeScript(),
    )
    .build('main');
