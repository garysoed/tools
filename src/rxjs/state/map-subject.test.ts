import {assert, should, test} from 'gs-testing';

import {MapSubject} from './map-subject';


test('@tools/src/rxjs/state/map-subject', () => {
  test('get', () => {
    should('return the value corresponding to the key', () => {
      const map$ = new MapSubject(new Map([['a', 1], ['b', 2]]));
      assert(map$.get('b')).to.emitWith(2);
    });

    should('return undefined if the key doesn\'t exist', () => {
      const map$ = new MapSubject(new Map([['a', 1], ['b', 2]]));
      assert(map$.get('c')).to.emitWith(undefined);
    });
  });

  test('set', () => {
    should('update the value correctly', () => {
      const map$ = new MapSubject(new Map([['a', 1], ['b', 2]]));
      map$.set('a', 0);
      assert(map$.get('a')).to.emitWith(0);
    });

    should('add the value if the key does not exist', () => {
      const map$ = new MapSubject(new Map([['a', 1], ['b', 2]]));
      map$.set('c', 3);
      assert(map$.get('c')).to.emitWith(3);
    });
  });
});