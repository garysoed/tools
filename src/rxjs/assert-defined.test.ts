import {asyncAssert, should, test} from 'gs-testing';
import {of as observableOf} from 'rxjs';

import {assertDefined} from './assert-defined';


test('@tools/rxjs/assert-defined', () => {
  should('emit the object if defined', async () => {
    await asyncAssert(observableOf(2).pipe(assertDefined())).to.emitWith(2);
  });

  should('throw error if undefined', async () => {
    await asyncAssert(observableOf(undefined).pipe(assertDefined()))
        .to.emitErrorWithMessage(/to be defined/);
  });
});
