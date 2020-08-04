const glob = require("glob");
const webpackBuilder = require('dev/webpack/builder');

module.exports = webpackBuilder(__dirname)
    .forDevelopment('[default]', builder => builder
        .addEntry('entry', glob.sync('./src/**/*.test.ts'))
        .setOutput('bundle.js', '/out')
        .addTypeScript()
    )
    .forDevelopment('docs', builder => builder
        .addEntry('docs', ['./docassets/index.ts'])
        .setOutput('index.js', '/out')
        .setSingleRun(true)
        .addTypeScript()
    )
.build();
