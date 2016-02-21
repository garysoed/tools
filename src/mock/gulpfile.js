var gn = require('../../gulp/gulp-node')(__dirname, require('gulp'));
var typescriptTasks = require('../../gulp-tasks/typescript')(
    require('gulp-tslint'),
    require('gulp-typescript'));

gn.exec('lint', typescriptTasks.lint(gn, 'src/mock'));
