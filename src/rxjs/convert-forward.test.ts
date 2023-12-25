import {asyncAssert, createSpySubject, should, test} from 'gs-testing';
import {of as observableOf} from 'rxjs';

import {integerConverter} from '../serializer/integer-converter';

import {convertForward} from './convert-forward';


test('@tools/rxjs/convert-forward', () => {
  should('emit the correct result when successful', async () => {
    const result$ = createSpySubject(observableOf(123).pipe(convertForward(integerConverter())));

    await asyncAssert(result$).to.emitSequence([123]);
  });

  should('not emit when unsuccessful', async () => {
    const result$ = createSpySubject(
        observableOf(1.23).pipe(convertForward(integerConverter())),
    );

    await asyncAssert(result$).toNot.emit();
  });
});
