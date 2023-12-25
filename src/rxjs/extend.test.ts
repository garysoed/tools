import {asyncAssert, createSpySubject, objectThat, should, test} from 'gs-testing';
import {of} from 'rxjs';

import {extend} from './extend';


interface TestObject {
  readonly a: number;
  readonly b: number;
}

test('@tools/rxjs/extend', () => {
  should('extend the input values', async () => {
    const results$ = createSpySubject(of({a: 1}, {b: 2}).pipe(extend({a: 2, b: 3})));

    await asyncAssert(results$).to.emitSequence([
      objectThat<TestObject>().haveProperties({a: 1, b: 3}),
      objectThat<TestObject>().haveProperties({a: 2, b: 2}),
    ]);
  });
});