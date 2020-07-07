import { assert, createSpySubject, run, should, test } from 'gs-testing';
import { of as observableOf } from 'rxjs';

import { integerConverter } from '../serializer/integer-converter';

import { convertForward } from './convert-forward';

test('@tools/rxjs/convert-forward', () => {
  should(`emit the correct result when successful`, () => {
    const result$ = createSpySubject(observableOf(123).pipe(convertForward(integerConverter())));

    assert(result$).to.emitSequence([123]);
  });

  should(`not emit when unsuccessful`, () => {
    const result$ = createSpySubject(
        observableOf(1.23).pipe(convertForward(integerConverter())),
    );

    assert(result$).toNot.emit();
  });
});
