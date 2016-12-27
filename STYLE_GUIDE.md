# Files
-   No default exports.
-   File names must use `lower-case-with-dashes`.
-   Test files must have a `_test` suffix.

# Imports
-   Imports should be grouped by:
    1.  External packages coming from the same package.
    1.  Imports coming from the current package but in different directories.
    1.  Imports coming from the same directory.

    The ordering must follow that.
-   External import groups must be ordered by package names.
-   Each named import group must be ordered alphabetically.
-   Add one empty line between import groups.
-   For tests, the first 2 lines must be importing `test-base` and calling setup.

Example:

```typescript
import {assert, Matchers, TestBase} from '../test-base';
TestBase.setup();

import {Validate} from 'external/gs_tools/src/util';

import {BasicButton} from 'external/gs_ui/src/input';
import {Breadcrumb} from 'external/gs_ui/src/routing';

import {Interval} from '../async/interval';
import {TestDispose} from '../testing/test-dispose';

import {Sequencer} from './sequencer';
```

*DONE projects: `gs_tools`*

# Classes
-   All private properties must be readonly if possible.
-   Private properties must be ordered by:
    1.  Annotated properties first.
    1.  Read only properties first.
    1.  Alphabetical order.