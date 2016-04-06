var path = require('path');

var TypedocTasks = function(typedoc) {
  this.typedoc_ = typedoc;
};

TypedocTasks.prototype.compile = function(gn, extraSrcs) {
  var srcs = ['**/*.ts', '!src/**/*_test.ts', '!src/test-base.ts', '!node_modules/**'];
  var themePath = path.resolve(path.dirname(__filename), '../typedoc-theme');

  return function compileTypedoc_() {
    return gn.src(srcs.concat(extraSrcs))
        .pipe(this.typedoc_({
          "target": "es5",
          "module": "commonjs",
          "moduleResolution": "node",
          "isolatedModules": false,
          "jsx": "react",
          "experimentalDecorators": true,
          "emitDecoratorMetadata": true,
          "noImplicitAny": false,
          "noLib": false,
          "preserveConstEnums": true,
          "suppressImplicitAnyIndexErrors": true,
          "rootDir": __dirname,

          out: "./doc",
          json: "doc/doc.json",

          // TypeDoc options (see typedoc docs)
          name: "gs-tools",
          theme: themePath,
          ignoreCompilerErrors: false,
          version: true,
        }));
  }.bind(this);
};

/**
 * @param {gulp-typedoc} typedoc
 */
module.exports = function(typedoc) {
  return new TypedocTasks(typedoc);
};
