import { test, should, setup, assert, match } from '@gs-testing/main';
import { scan } from 'rxjs/operators';
import { SpySubject, createSpySubject } from '@gs-testing/spy';
import { MapSubject } from './map-subject';
import { ImmutableMap } from '../collect/types/immutable-map';
import { MapDiff } from './map-observable';

test('gs-tools.rxjs.MapSubject', () => {
  let subject: MapSubject<string, number>;
  let mapSpySubject: SpySubject<ImmutableMap<string, number>>;
  let scanSpySubject: SpySubject<Map<string, number>>;

  setup(() => {
    subject = new MapSubject([['a', 1], ['b', 2], ['c', 3]]);

    mapSpySubject = new SpySubject();
    subject.getObs().subscribe(mapSpySubject);

    scanSpySubject = new SpySubject();
    subject.getDiffs()
        .pipe(
            scan<MapDiff<string, number>, Map<string, number>>((acc, diff) => {
              switch (diff.type) {
                case 'delete':
                  acc.delete(diff.key);
                  return acc;
                case 'init':
                  return diff.payload;
                case 'set':
                  acc.set(diff.key, diff.value);
                  return acc;
              }
            }, new Map<string, number>()),
        )
        .subscribe(scanSpySubject);
  });

  test('delete', () => {
    should(`delete the item correctly`, async () => {
      subject.delete('b');

      await assert(mapSpySubject).to.emitWith(
          match.anyIterableThat<[string, number], ImmutableMap<string, number>>().haveElements([
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
        payload: match.anyIterableThat<[string, number], Map<string, number>>().startWith([
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
          match.anyIterableThat<[string, number], ImmutableMap<string, number>>().haveElements([
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
          match.anyIterableThat<[string, number], ImmutableMap<string, number>>().haveElements([
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
