import {assert, createSpySubject, mapThat, objectThat, should, test} from 'gs-testing';
import {of as observableOf} from 'rxjs';

import {MapDiff, diffMap, mapValueMapDiff, scanMap} from './map-diff';


test('@tools/rxjs/state/map-diff', () => {
  test('diff', () => {
    should('emit the correct diffs', () => {
      const maps$ = observableOf(
          new Map([['a', 1], ['b', 2], ['c', 3]]),
          new Map([['b', 6], ['c', 3], ['d', 4]]),
      );
      const diff$ = createSpySubject(maps$.pipe(diffMap()));

      assert(diff$).to.emitSequence([
        objectThat<MapDiff<string, number>>().haveProperties({type: 'set', key: 'a', value: 1}),
        objectThat<MapDiff<string, number>>().haveProperties({type: 'set', key: 'b', value: 2}),
        objectThat<MapDiff<string, number>>().haveProperties({type: 'set', key: 'c', value: 3}),
        objectThat<MapDiff<string, number>>().haveProperties({type: 'delete', key: 'a'}),
        objectThat<MapDiff<string, number>>().haveProperties({type: 'set', key: 'b', value: 6}),
        objectThat<MapDiff<string, number>>().haveProperties({type: 'set', key: 'd', value: 4}),
      ]);
    });
  });

  test('mapValueMapDiff', () => {
    should('emit the correct mapped values', () => {
      const maps$ = observableOf(
          new Map([['a', 1], ['b', 2], ['c', 3]]),
          new Map([['b', 6], ['c', 3], ['d', 4]]),
      );
      const diff$ = createSpySubject(maps$.pipe(
          diffMap(),
          mapValueMapDiff((value, key) => `${key}${value}`),
      ));

      assert(diff$).to.emitSequence([
        objectThat<MapDiff<string, string>>().haveProperties({type: 'set', key: 'a', value: 'a1'}),
        objectThat<MapDiff<string, string>>().haveProperties({type: 'set', key: 'b', value: 'b2'}),
        objectThat<MapDiff<string, string>>().haveProperties({type: 'set', key: 'c', value: 'c3'}),
        objectThat<MapDiff<string, string>>().haveProperties({type: 'delete', key: 'a'}),
        objectThat<MapDiff<string, string>>().haveProperties({type: 'set', key: 'b', value: 'b6'}),
        objectThat<MapDiff<string, string>>().haveProperties({type: 'set', key: 'd', value: 'd4'}),
      ]);
    });
  });

  test('scanMap', () => {
    should('emit the correct maps', () => {
      const maps$ = observableOf(
          new Map([['a', 1], ['b', 2], ['c', 3]]),
          new Map([['b', 6], ['c', 3], ['d', 4]]),
      );
      const diff$ = createSpySubject(maps$.pipe(diffMap(), scanMap()));

      assert(diff$).to.emitSequence([
        mapThat<string, number>().haveExactElements(new Map([['a', 1]])),
        mapThat<string, number>().haveExactElements(new Map([['a', 1], ['b', 2]])),
        mapThat<string, number>().haveExactElements(new Map([['a', 1], ['b', 2], ['c', 3]])),
        mapThat<string, number>().haveExactElements(new Map([['b', 2], ['c', 3]])),
        mapThat<string, number>().haveExactElements(new Map([['b', 6], ['c', 3]])),
        mapThat<string, number>().haveExactElements(new Map([['b', 6], ['c', 3], ['d', 4]])),
      ]);
    });
  });
});
