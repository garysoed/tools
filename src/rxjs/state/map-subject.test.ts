import { assert, createSpySubject, match, setup, should, SpySubject, test } from '@gs-testing';
import { scan } from '@rxjs/operators';
import { MapDiff, scanMap } from './map-observable';
import { MapSubject } from './map-subject';

test('@gs-tools/rxjs/state/map-subject', () => {
  let subject: MapSubject<string, number>;
  let mapSpySubject: SpySubject<Map<string, number>>;
  let scanSpySubject: SpySubject<Map<string, number>>;

  setup(() => {
    subject = new MapSubject([['a', 1], ['b', 2], ['c', 3]]);

    mapSpySubject = new SpySubject();
    subject.pipe(scanMap()).subscribe(mapSpySubject);

    scanSpySubject = new SpySubject();
    subject
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
        )
        .subscribe(scanSpySubject);
  });

  test('delete', () => {
    should(`delete the item correctly`, () => {
      subject.delete('b');

      assert(mapSpySubject).to.emitWith(
          match.anyMapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['c', 3],
          ])),
      );

      assert(scanSpySubject).to.emitWith(
          match.anyMapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['c', 3],
          ])),
      );
    });

    should(`be noop if the item does not exist`, () => {
      mapSpySubject.reset();
      scanSpySubject.reset();

      subject.delete('d');

      assert(mapSpySubject).toNot.emit();
      assert(scanSpySubject).toNot.emit();
    });
  });

  test('getDiffs', () => {
    should(`emit correctly`, () => {
      const spySubject = createSpySubject();
      subject.subscribe(spySubject);

      assert(spySubject).to.emitWith(match.anyObjectThat().haveProperties({
        type: 'init',
        value: match.anyMapThat<string, number>().haveExactElements(new Map([
          ['a', 1],
          ['b', 2],
          ['c', 3],
        ])),
      }));

      subject.delete('b');
      assert(spySubject).to.emitWith(match.anyObjectThat().haveProperties({
        key: 'b',
        type: 'delete',
      }));
    });
  });

  test('next', () => {
    should(`handle delete correctly`, () => {
      subject.next({type: 'delete', key: 'b'});

      assert(mapSpySubject).to.emitWith(
          match.anyMapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['c', 3],
          ])),
      );

      assert(scanSpySubject).to.emitWith(
          match.anyMapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['c', 3],
          ])),
      );
    });

    should(`handle init correctly`, () => {
      subject.next({type: 'init', value: new Map([['e', 5], ['c', 4], ['b', 2]])});

      assert(mapSpySubject).to.emitWith(
          match.anyMapThat<string, number>().haveExactElements(new Map([
            ['b', 2],
            ['c', 4],
            ['e', 5],
          ])),
      );

      assert(scanSpySubject).to.emitWith(
          match.anyMapThat<string, number>().haveExactElements(new Map([
            ['b', 2],
            ['c', 4],
            ['e', 5],
          ])),
      );
    });

    should(`handle set correctly`, () => {
      subject.next({type: 'set', key: 'b', value: 6});

      assert(mapSpySubject).to.emitWith(
          match.anyMapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['b', 6],
            ['c', 3],
          ])),
      );

      assert(scanSpySubject).to.emitWith(
          match.anyMapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['b', 6],
            ['c', 3],
          ])),
      );
    });
  });

  test('setAll', () => {
    should(`set all the items correctly`, () => {
      subject.setAll(new Map([['e', 5], ['c', 4], ['b', 2]]));

      assert(mapSpySubject).to.emitWith(
          match.anyMapThat<string, number>().haveExactElements(new Map([
            ['b', 2],
            ['c', 4],
            ['e', 5],
          ])),
      );

      assert(scanSpySubject).to.emitWith(
          match.anyMapThat<string, number>().haveExactElements(new Map([
            ['b', 2],
            ['c', 4],
            ['e', 5],
          ])),
      );
    });
  });

  test('set', () => {
    should(`set the item correctly`, () => {
      subject.set('b', 6);

      assert(mapSpySubject).to.emitWith(
          match.anyMapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['b', 6],
            ['c', 3],
          ])),
      );

      assert(scanSpySubject).to.emitWith(
          match.anyMapThat<string, number>().haveExactElements(new Map([
            ['a', 1],
            ['b', 6],
            ['c', 3],
          ])),
      );
    });

    should(`be noop if the item is already set`, () => {
      mapSpySubject.reset();
      scanSpySubject.reset();

      subject.set('b', 2);

      assert(mapSpySubject).toNot.emit();
      assert(scanSpySubject).toNot.emit();
    });
  });
});
