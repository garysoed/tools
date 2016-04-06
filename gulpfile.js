var gn = require('./gulp/gulp-node')(__dirname, require('gulp'));
var karmaTasks = require('./gulp-tasks/karma')(require('karma').Server);
var typedocTasks = require('./gulp-tasks/typedoc')(require('gulp-typedoc'));

gn.task('compile-test', gn.parallel(
    'src:compile-test',
    'src/collection:compile-test',
    'src/data:compile-test',
    'src/dispose:compile-test',
    'src/net:compile-test',
    'src/ng:compile-test',
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
    'src/net:lint',
    'src/ng:lint',
    'src/typescript:lint',
    'src/ui:lint'
));

gn.exec('lint', gn.series('.:lint'));
gn.exec(
    'doc',
    typedocTasks.compile(gn, ['!src/test-base.ts', 'node_modules/typescript/lib/lib.es6.d.ts']));

var mockAngular = {
  pattern: 'src/testing/mock-angular.js',
  included: true
};
gn.exec('test', gn.series('.:compile-test', karmaTasks.once(gn, '**', [mockAngular])));
gn.exec('karma', gn.series('.:compile-test', karmaTasks.watch(gn, '**', [mockAngular])));

gn.exec('watch-test', gn.series(
    '.:compile-test',
    function _watch() {
      gn.watch(['src/**/*.ts'], gn.series('.:compile-test'));
    }));
