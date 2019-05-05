import { assert, createSpySubject, match, setup, should, SpySubject, test } from '@gs-testing';
import { scan } from '@rxjs/operators';
import { MapDiff, scanMap } from './map-observable';
import { MapSubject } from './map-subject';

test('@gs-tools/rxjs/map-subject', () => {
  let subject: MapSubject<string, number>;
  let mapSpySubject: SpySubject<Map<string, number>>;
  let scanSpySubject: SpySubject<Map<string, number>>;

  setup(() => {
    subject = new MapSubject([['a', 1], ['b', 2], ['c', 3]]);

    mapSpySubject = new SpySubject();
    subject.getDiffs().pipe(scanMap()).subscribe(mapSpySubject);

    scanSpySubject = new SpySubject();
    subject.getDiffs()
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
    should(`delete the item correctly`, async () => {
      subject.delete('b');

      await assert(mapSpySubject).to.emitWith(
          match.anyIterableThat<[string, number], Map<string, number>>().haveElements([
            match.anyTupleThat<[string, number]>().haveExactElements(['a', 1]),
            match.anyTupleThat<[string, number]>().haveExactElements(['c', 3]),
          ]));

      await assert(scanSpySubject).to.emitWith(
          match.anyIterableThat<[string, number], Map<string, number>>().haveElements([
            match.anyTupleThat<[string, number]>().haveExactElements(['a', 1]),
            match.anyTupleThat<[string, number]>().haveExactElements(['c', 3]),
          ]));
    });

    should(`be noop if the item does not exist`, async () => {
      mapSpySubject.reset();
      scanSpySubject.reset();

      subject.delete('d');

      await assert(mapSpySubject).toNot.emit();
      await assert(scanSpySubject).toNot.emit();
    });
  });

  test('getDiffs', () => {
    should(`emit correctly`, async () => {
      const spySubject = createSpySubject();
      subject.getDiffs().subscribe(spySubject);

      await assert(spySubject).to.emitWith(match.anyObjectThat().haveProperties({
        value: match.anyIterableThat<[string, number], Map<string, number>>().startWith([
          match.anyTupleThat<[string, number]>().haveExactElements(['a', 1]),
          match.anyTupleThat<[string, number]>().haveExactElements(['b', 2]),
          match.anyTupleThat<[string, number]>().haveExactElements(['c', 3]),
        ]),
        type: 'init',
      }));

      subject.delete('b');
      await assert(spySubject).to.emitWith(match.anyObjectThat().haveProperties({
        key: 'b',
        type: 'delete',
      }));
    });
  });

  test('setAll', () => {
    should(`set all the items correctly`, async () => {
      subject.setAll(new Map([['e', 5], ['c', 4], ['b', 2]]));

      await assert(mapSpySubject).to.emitWith(
          match.anyIterableThat<[string, number], Map<string, number>>().haveElements([
            match.anyTupleThat<[string, number]>().haveExactElements(['b', 2]),
            match.anyTupleThat<[string, number]>().haveExactElements(['c', 4]),
            match.anyTupleThat<[string, number]>().haveExactElements(['e', 5]),
          ]));

      await assert(scanSpySubject).to.emitWith(
          match.anyIterableThat<[string, number], Map<string, number>>().haveElements([
            match.anyTupleThat<[string, number]>().haveExactElements(['b', 2]),
            match.anyTupleThat<[string, number]>().haveExactElements(['c', 4]),
            match.anyTupleThat<[string, number]>().haveExactElements(['e', 5]),
          ]));
    });
  });

  test('set', () => {
    should(`set the item correctly`, async () => {
      subject.set('b', 6);

      await assert(mapSpySubject).to.emitWith(
          match.anyIterableThat<[string, number], Map<string, number>>().haveElements([
            match.anyTupleThat<[string, number]>().haveExactElements(['a', 1]),
            match.anyTupleThat<[string, number]>().haveExactElements(['b', 6]),
            match.anyTupleThat<[string, number]>().haveExactElements(['c', 3]),
          ]));

      await assert(scanSpySubject).to.emitWith(
          match.anyIterableThat<[string, number], Map<string, number>>().haveElements([
            match.anyTupleThat<[string, number]>().haveExactElements(['a', 1]),
            match.anyTupleThat<[string, number]>().haveExactElements(['b', 6]),
            match.anyTupleThat<[string, number]>().haveExactElements(['c', 3]),
          ]));
    });

    should(`be noop if the item is already set`, async () => {
      mapSpySubject.reset();
      scanSpySubject.reset();

      subject.set('b', 2);

      await assert(mapSpySubject).toNot.emit();
      await assert(scanSpySubject).toNot.emit();
    });
  });
});
