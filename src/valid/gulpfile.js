var gn = require('../../gulp/gulp-node')(__dirname, require('gulp'));
var tasks = require('../../gulptasks');

tasks.allTests(gn, 'valid');
