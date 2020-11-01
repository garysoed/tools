import { assert, createSpySubject, should, test } from 'gs-testing';
import { of as observableOf } from 'rxjs';

import { integerConverter } from '../serializer/integer-converter';

import { convertBackward } from './convert-backward';


test('@tools/rxjs/convert-backward', () => {
  should('emit the correct result when successful', () => {
    const result$ = createSpySubject(observableOf(123).pipe(convertBackward(integerConverter())));

    assert(result$).to.emitSequence([123]);
  });

  should('not emit when unsuccessful', () => {
    const result$ = createSpySubject(
        observableOf(1.23).pipe(convertBackward(integerConverter(false))),
    );

    assert(result$).toNot.emit();
  });
});
