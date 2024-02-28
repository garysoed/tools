import {asyncAssert, should, test} from 'gs-testing';

import {MapSubject} from './map-subject';

test('@tools/src/rxjs/state/map-subject', () => {
  test('get', () => {
    should('return the value corresponding to the key', async () => {
      const map$ = new MapSubject(
        new Map([
          ['a', 1],
          ['b', 2],
        ]),
      );
      await asyncAssert(map$.get('b')).to.emitWith(2);
    });

    should("return undefined if the key doesn't exist", async () => {
      const map$ = new MapSubject(
        new Map([
          ['a', 1],
          ['b', 2],
        ]),
      );
      await asyncAssert(map$.get('c')).to.emitWith(undefined);
    });
  });

  test('set', () => {
    should('update the value correctly', async () => {
      const map$ = new MapSubject(
        new Map([
          ['a', 1],
          ['b', 2],
        ]),
      );
      map$.set('a', 0);
      await asyncAssert(map$.get('a')).to.emitWith(0);
    });

    should('add the value if the key does not exist', async () => {
      const map$ = new MapSubject(
        new Map([
          ['a', 1],
          ['b', 2],
        ]),
      );
      map$.set('c', 3);
      await asyncAssert(map$.get('c')).to.emitWith(3);
    });
  });
});
