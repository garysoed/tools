import {asyncAssert, should, test} from 'gs-testing';
import {numberType} from 'gs-types';
import {of as observableOf} from 'rxjs';

import {assertByType} from './assert-by-type';

test('@tools/rxjs/assert-by-type', () => {
  should('emit the item if type is correct', async () => {
    await asyncAssert(observableOf(2).pipe(assertByType(numberType))).to.emitWith(2);
  });

  should('throw error if type is incorrect', async () => {
    await asyncAssert(observableOf('test').pipe(assertByType(numberType))).to
        .emitErrorWithMessage(/not of type/);
  });
});
