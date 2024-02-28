import {asyncAssert, should, test} from 'gs-testing';
import {of as observableOf} from 'rxjs';

import {assertNonNull} from './assert-non-null';

test('@tools/rxjs/assert-non-null', () => {
  should('emit the value if non null', async () => {
    await asyncAssert(observableOf(2).pipe(assertNonNull())).to.emitWith(2);
  });

  should('throw error if null', async () => {
    await asyncAssert(
      observableOf(null).pipe(assertNonNull()),
    ).to.emitErrorWithMessage(/not be null/);
  });
});
