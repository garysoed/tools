var path = require('path');

var SassTasks = require('./sass');

var TypedocTasks = function(concat, sass, typedoc) {
  this.concat_ = concat;
  this.sass_ = sass;
  this.typedoc_ = typedoc;
};

TypedocTasks.prototype.compile = function(gn, extraSrcs, projectName, themeName) {
  var srcs = ['**/*.ts', '!src/**/*_test.ts', '!src/test-base.ts', '!node_modules/**'];
  var themePath = path.resolve(path.dirname(__filename), '../typedoc-theme');
  var sassTasks = SassTasks(this.concat_, this.sass_);

  return gn.series(
    function compileTypedoc_() {
        return gn.src(srcs.concat(extraSrcs))
            .pipe(this.typedoc_({
              target: 'es5',
              module: 'commonjs',
              moduleResolution: 'node',
              isolatedModules: false,
              jsx: 'react',
              experimentalDecorators: true,
              emitDecoratorMetadata: true,
              noImplicitAny: false,
              noLib: false,
              preserveConstEnums: true,
              suppressImplicitAnyIndexErrors: true,
              rootDir: __dirname,

              out: './doc',
              json: 'doc/doc.json',

              // TypeDoc options (see typedoc docs)
              name: projectName,
              theme: themePath,
              ignoreCompilerErrors: false,
              version: true,
            }));
      }.bind(this),
      function copyTheme_() {
        return gn.src(path.resolve(path.dirname(__filename), '../themes', themeName + '.scss'))
            .pipe(this.concat_('theme.scss'))
            .pipe(gn.dest('doc/assets/css'));
      }.bind(this),
      sassTasks.compile(gn, path.resolve('doc/assets/css/**'), 'doc/assets/css')
  );
};

/**
 * @param {gulp-typedoc} typedoc
 */
module.exports = function(concat, sass, typedoc) {
  return new TypedocTasks(concat, sass, typedoc);
};
