import {asyncAssert, createSpySubject, should, test} from 'gs-testing';
import {of as observableOf} from 'rxjs';

import {integerConverter} from '../serializer/integer-converter';

import {convertBackward} from './convert-backward';

test('@tools/rxjs/convert-backward', () => {
  should('emit the correct result when successful', async () => {
    const result$ = createSpySubject(
      observableOf(123).pipe(convertBackward(integerConverter())),
    );

    await asyncAssert(result$).to.emitSequence([123]);
  });

  should('not emit when unsuccessful', async () => {
    const result$ = createSpySubject(
      observableOf(1.23).pipe(convertBackward(integerConverter(false))),
    );

    await asyncAssert(result$).toNot.emit();
  });
});
