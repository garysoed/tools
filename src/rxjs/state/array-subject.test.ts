import {arrayThat, assert, should, test} from 'gs-testing';

import {ArraySubject} from './array-subject';


test('@tools/src/rxjs/state/array-subject', () => {
  test('get', () => {
    should('emit values in the given index', () => {
      const array$ = new ArraySubject([1, 2, 3]);
      assert(array$.get(1)).to.emitWith(2);
    });

    should('emit undefined if there are no elements in the given index', () => {
      const array$ = new ArraySubject([1, 2, 3]);
      assert(array$.get(3)).to.emitWith(undefined);
    });
  });

  test('push', () => {
    should('push the new element to the array', () => {
      const array$ = new ArraySubject([1, 2, 3]);
      array$.push(4, 5, 6);
      assert(array$).to.emitWith(arrayThat<number>().haveExactElements([1, 2, 3, 4, 5, 6]));
    });
  });

  test('set', () => {
    should('set the element at the given index', () => {
      const array$ = new ArraySubject([1, 2, 3]);
      array$.set(1, 6);
      assert(array$).to.emitWith(arrayThat<number>().haveExactElements([1, 6, 3]));
    });
  });
});