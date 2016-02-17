var gn = require('./gulp/gulp-node')(__dirname, require('gulp'));
var karmaTasks = require('./gulp-tasks/karma')(require('karma').Server);

gn.task('compile-test', gn.parallel(
    'src:compile-test',
    'src/collection:compile-test'
));

gn.exec('test', gn.series('.:compile-test', karmaTasks.once(gn, '**')));
