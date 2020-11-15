import {arrayThat, assert, createSpySubject, objectThat, should, test} from 'gs-testing';
import {of as observableOf} from 'rxjs';

import {ArrayDiff, diffArray, mapArrayDiff, scanArray} from './array-diff';


test('@tools/rxjs/state/array-diff', () => {
  test('diffArray', () => {
    should('emit the correct diffs', () => {
      const arrays$ = observableOf([2, 4, 7], [2, 3, 4, 5, 6]);
      const diff$ = createSpySubject(arrays$.pipe(diffArray()));

      assert(diff$).to.emitSequence([
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 0, value: 2}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 1, value: 4}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 2, value: 7}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 1, value: 3}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 3, value: 5}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 4, value: 6}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'delete', index: 5, value: 7}),
      ]);
    });

    interface Test {
      readonly id: number;
    }

    should('compare using the given function', () => {
      const arrays$ = observableOf(
          [{id: 2}, {id: 4}, {id: 7}],
          [{id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}],
      );
      const diff$ = createSpySubject(
          arrays$.pipe(diffArray((a, b) => a.id === b.id)),
      );

      assert(diff$).to.emitSequence([
        objectThat<ArrayDiff<Test>>().haveProperties({
          type: 'insert',
          index: 0,
          value: objectThat<Test>().haveProperties({id: 2}),
        }),
        objectThat<ArrayDiff<Test>>().haveProperties({
          type: 'insert',
          index: 1,
          value: objectThat<Test>().haveProperties({id: 4}),
        }),
        objectThat<ArrayDiff<Test>>().haveProperties({
          type: 'insert',
          index: 2,
          value: objectThat<Test>().haveProperties({id: 7}),
        }),
        objectThat<ArrayDiff<Test>>().haveProperties({
          type: 'insert',
          index: 1,
          value: objectThat<Test>().haveProperties({id: 3}),
        }),
        objectThat<ArrayDiff<Test>>().haveProperties({
          type: 'insert',
          index: 3,
          value: objectThat<Test>().haveProperties({id: 5}),
        }),
        objectThat<ArrayDiff<Test>>().haveProperties({
          type: 'insert',
          index: 4,
          value: objectThat<Test>().haveProperties({id: 6}),
        }),
        objectThat<ArrayDiff<Test>>().haveProperties({
          type: 'delete',
          index: 5,
          value: objectThat<Test>().haveProperties({id: 7}),
        }),
      ]);
    });
  });

  test('mapArrayDiff', () => {
    should('emit the correct mapped values', () => {
      const arrays$ = observableOf([2, 4, 7], [2, 3, 4, 5, 6]);
      const diff$ = createSpySubject(arrays$.pipe(diffArray(), mapArrayDiff(v => v * 2)));

      assert(diff$).to.emitSequence([
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 0, value: 4}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 1, value: 8}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 2, value: 14}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 1, value: 6}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 3, value: 10}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'insert', index: 4, value: 12}),
        objectThat<ArrayDiff<number>>().haveProperties({type: 'delete', index: 5, value: 14}),
      ]);
    });
  });

  test('scanArray', () => {
    should('emit the correct arrays', () => {
      const arrays$ = observableOf([2, 4, 7], [2, 3, 4, 5, 6]);
      const diff$ = createSpySubject(arrays$.pipe(diffArray(), scanArray()));

      assert(diff$).to.emitSequence([
        arrayThat<number>().haveExactElements([2]),
        arrayThat<number>().haveExactElements([2, 4]),
        arrayThat<number>().haveExactElements([2, 4, 7]),
        arrayThat<number>().haveExactElements([2, 3, 4, 7]),
        arrayThat<number>().haveExactElements([2, 3, 4, 5, 7]),
        arrayThat<number>().haveExactElements([2, 3, 4, 5, 6, 7]),
        arrayThat<number>().haveExactElements([2, 3, 4, 5, 6]),
      ]);
    });
  });
});

