import { assert, createSpySubject, mapThat, objectThat, should, test } from 'gs-testing';
import { scan } from 'rxjs/operators';

import { MapDiff, scanMap } from './map-observable';
import { MapSubject } from './map-subject';

test('@gs-tools/rxjs/state/map-subject', init => {
  const _ = init(() => {
    const subject = new MapSubject([['a', 1], ['b', 2], ['c', 3]]);

    const mapSpySubject = createSpySubject(subject.pipe(scanMap()));

    const scan$ = subject
        .pipe(
            scan<MapDiff<string, number>, Map<string, number>>(
                (acc, diff) => {
                  switch (diff.type) {
                    case 'delete':
                      acc.delete(diff.key);

                      return acc;
                    case 'init':
                      return diff.value;
                    case 'set':
                      acc.set(diff.key, diff.value);

                      return acc;
                  }
                },
                new Map<string, number>()),
        );
    const scanSpySubject = createSpySubject(scan$);

    return {subject, mapSpySubject, scanSpySubject};
  });

  test('delete', () => {
    should(`delete the item correctly`, () => {
      _.subject.delete('b');

      assert(_.mapSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['c', 3],
          ])),
      );

      assert(_.scanSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['c', 3],
          ])),
      );
    });

    should(`be noop if the item does not exist`, () => {
      _.subject.delete('d');

      assert(_.mapSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['b', 2],
            ['c', 3],
          ])),
      );

      assert(_.scanSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['b', 2],
            ['c', 3],
          ])),
      );
    });
  });

  test('getDiffs', () => {
    should(`emit correctly`, () => {
      const spySubject = createSpySubject(_.subject);

      assert(spySubject).to.emitWith(objectThat<MapDiff<string, number>>().haveProperties({
        type: 'init',
        value: mapThat<string, number>().haveExactElements(new Map([
          ['a', 1],
          ['b', 2],
          ['c', 3],
        ])),
      }));

      _.subject.delete('b');
      assert(spySubject).to.emitWith(objectThat<MapDiff<string, number>>().haveProperties({
        key: 'b',
        type: 'delete',
      }));
    });
  });

  test('next', () => {
    should(`handle delete correctly`, () => {
      _.subject.next({type: 'delete', key: 'b'});

      assert(_.mapSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['c', 3],
          ])),
      );

      assert(_.scanSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['c', 3],
          ])),
      );
    });

    should(`handle init correctly`, () => {
      _.subject.next({type: 'init', value: new Map([['e', 5], ['c', 4], ['b', 2]])});

      assert(_.mapSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['b', 2],
            ['c', 4],
            ['e', 5],
          ])),
      );

      assert(_.scanSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['b', 2],
            ['c', 4],
            ['e', 5],
          ])),
      );
    });

    should(`handle set correctly`, () => {
      _.subject.next({type: 'set', key: 'b', value: 6});

      assert(_.mapSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['b', 6],
            ['c', 3],
          ])),
      );

      assert(_.scanSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['b', 6],
            ['c', 3],
          ])),
      );
    });
  });

  test('setAll', () => {
    should(`set all the items correctly`, () => {
      _.subject.setAll(new Map([['e', 5], ['c', 4], ['b', 2]]));

      assert(_.mapSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['b', 2],
            ['c', 4],
            ['e', 5],
          ])),
      );

      assert(_.scanSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['b', 2],
            ['c', 4],
            ['e', 5],
          ])),
      );
    });
  });

  test('set', () => {
    should(`set the item correctly`, () => {
      _.subject.set('b', 6);

      assert(_.mapSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['b', 6],
            ['c', 3],
          ])),
      );

      assert(_.scanSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['b', 6],
            ['c', 3],
          ])),
      );
    });

    should(`be noop if the item is already set`, () => {
      _.subject.set('b', 2);

      assert(_.mapSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['b', 2],
            ['c', 3],
          ])),
      );

      assert(_.scanSpySubject).to.emitWith(
          mapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['b', 2],
            ['c', 3],
          ])),
      );
    });
  });
});
