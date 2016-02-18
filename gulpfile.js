var gn = require('./gulp/gulp-node')(__dirname, require('gulp'));
var karmaTasks = require('./gulp-tasks/karma')(require('karma').Server);

gn.task('compile-test', gn.parallel(
    'src:compile-test',
    'src/collection:compile-test',
    'src/dispose:compile-test'
));

gn.task('lint', gn.parallel(
    'src:lint',
    'src/collection:lint',
    'src/dispose:lint'
));

gn.exec('lint', gn.series('.:lint'));
gn.exec('test', gn.series('.:compile-test', karmaTasks.once(gn, '**')));
