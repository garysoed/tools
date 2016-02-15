# Gulp Node
## What is this?
Gulp node splits up gulp file into several files. This allows you to create Gulp tasks in sub
directories and refer to all of them from the root directory. For example, suppose this is your
directory structure:

```
(root)
|-- gulpfile.js ('test')
|-- src/
|   |-- rpc/
|   |   |-- gulpfile.js ('test')  
|   |-- other/
```

There are two `test` Gulp tasks in the project structure: one in the root directory, and one in
the `src/rpc`. The `test` Gulp task in `src/rpc` only runs tests in that directory, while the one in
root directory runs tests in the entire repository.

With Gulp node, you can execute the former `test` task by running:

```bash
gulp src/rpc:test
```

While if you want the more global `test` task, you can run:

```bash
gulp test
```

You can use the same naming convention to specify dependencies. For example:

```javascript
gn.task('test', gn.series('src/rpc:test', function() {
  // Runs other tests
}));
```

## Usage
### Basic usage
Usage is the same as `gulp 4.0`, with a few differences:

-   All gulp tasks must be declared in `gulpfile.js`.
-   Instead of `var gulp = require('gulp')`, do:

    ```javascript
    var gn = require('path/to/gulp-node')(__dirname).
    ```

    Use the returned Gulp node instance `gn` instead of `gulp`.
-   Whenever you use `gulp.task`, use `gn.exec` instead.

### Private tasks
Gulp node differentiates between tasks that are declared for dependencies and tasks that can be
executed. To create executable tasks, use `gn.exec`. For non executable tasks, use `gn.task`.

### Global tasks

You can have dependencies to tasks declared by `gulp.task` by referring to the task name. This is
one way to implement a global task, a task that can be referred from any directories.
