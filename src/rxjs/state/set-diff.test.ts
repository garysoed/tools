import {assert, createSpySubject, objectThat, setThat, should, test} from 'gs-testing';
import {of as observableOf} from 'rxjs';

import {SetDiff, diffSet, mapSetDiff, scanSet} from './set-diff';


test('@tools/rxjs/state/set-diff', () => {
  test('diff', () => {
    should('emit the correct diffs', () => {
      const sets$ = observableOf(new Set([1, 2, 3]), new Set([3, 2, 4]));
      const diff$ = createSpySubject(sets$.pipe(diffSet()));

      assert(diff$).to.emitSequence([
        objectThat<SetDiff<number>>().haveProperties({type: 'add', value: 1}),
        objectThat<SetDiff<number>>().haveProperties({type: 'add', value: 2}),
        objectThat<SetDiff<number>>().haveProperties({type: 'add', value: 3}),
        objectThat<SetDiff<number>>().haveProperties({type: 'delete', value: 1}),
        objectThat<SetDiff<number>>().haveProperties({type: 'add', value: 4}),
      ]);
    });
  });

  test('mapSetDiff', () => {
    should('emit the correct mapped values', () => {
      const sets$ = observableOf(new Set([1, 2, 3]), new Set([3, 2, 4]));
      const diff$ = createSpySubject(sets$.pipe(diffSet(), mapSetDiff(v => `${v}`)));

      assert(diff$).to.emitSequence([
        objectThat<SetDiff<string>>().haveProperties({type: 'add', value: '1'}),
        objectThat<SetDiff<string>>().haveProperties({type: 'add', value: '2'}),
        objectThat<SetDiff<string>>().haveProperties({type: 'add', value: '3'}),
        objectThat<SetDiff<string>>().haveProperties({type: 'delete', value: '1'}),
        objectThat<SetDiff<string>>().haveProperties({type: 'add', value: '4'}),
      ]);
    });
  });

  test('scanSet', () => {
    should('emit the correct sets', () => {
      const sets$ = observableOf(new Set([1, 2, 3]), new Set([3, 2, 4]));
      const diff$ = createSpySubject(sets$.pipe(diffSet(), scanSet()));

      assert(diff$).to.emitSequence([
        setThat<number>().haveExactElements(new Set([1])),
        setThat<number>().haveExactElements(new Set([1, 2])),
        setThat<number>().haveExactElements(new Set([1, 2, 3])),
        setThat<number>().haveExactElements(new Set([2, 3])),
        setThat<number>().haveExactElements(new Set([2, 3, 4])),
      ]);
    });
  });
});
