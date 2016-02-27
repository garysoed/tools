var gn = require('./gulp/gulp-node')(__dirname, require('gulp'));
var karmaTasks = require('./gulp-tasks/karma')(require('karma').Server);

gn.task('compile-test', gn.parallel(
    'src:compile-test',
    'src/collection:compile-test',
    'src/data:compile-test',
    'src/dispose:compile-test',
    'src/typescript:lint',
    'src/ui:compile-test'
));

gn.task('lint', gn.parallel(
    'src:lint',
    'src/collection:lint',
    'src/data:lint',
    'src/dispose:lint',
    'src/event:lint',
    'src/mock:lint',
    'src/typescript:lint',
    'src/ui:lint'
));

gn.exec('lint', gn.series('.:lint'));
gn.exec('test', gn.series('.:compile-test', karmaTasks.once(gn, '**')));
gn.exec('karma', gn.series('.:compile-test', karmaTasks.watch(gn, '**')));

gn.exec('watch-test', gn.series(
    '.:compile-test',
    function _watch() {
      gn.watch(['src/**/*.ts'], gn.series('.:compile-test'));
    }));
