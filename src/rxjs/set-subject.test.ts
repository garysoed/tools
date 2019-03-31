import { test, should, setup, assert, match } from '@gs-testing/main';
import { scan } from 'rxjs/operators';
import { SpySubject, createSpySubject } from '@gs-testing/spy';
import { SetSubject } from './set-subject';
import { SetDiff } from './set-observable';
import { ImmutableSet } from '../collect/types/immutable-set';

test('gs-tools.rxjs.SetSubject', () => {
  let subject: SetSubject<string>;
  let setSpySubject: SpySubject<ImmutableSet<string>>;
  let scanSpySubject: SpySubject<Set<string>>;

  setup(() => {
    subject = new SetSubject(['a', 'b', 'c']);

    setSpySubject = new SpySubject();
    subject.getObs().subscribe(setSpySubject);

    scanSpySubject = new SpySubject();
    subject.getDiffs()
        .pipe(
            scan<SetDiff<string>, Set<string>>((acc, diff) => {
              switch (diff.type) {
                case 'add':
                  acc.add(diff.value);
                  return acc;
                case 'delete':
                  acc.delete(diff.value);
                  return acc;
                case 'init':
                  return diff.payload;
              }
            }, new Set()),
        )
        .subscribe(scanSpySubject);
  });

  test('add', () => {
    should(`set the item correctly`, async () => {
      subject.add('d');

      await assert(setSpySubject).to.emitWith(
          match.anyIterableThat<string, ImmutableSet<string>>().haveElements(['a', 'b', 'c', 'd']));
      await assert(scanSpySubject).to.emitWith(
          match.anyIterableThat<string, Set<string>>().haveElements(['a', 'b', 'c', 'd']));
    });

    should(`be noop if the item is already in the set`, async () => {
      setSpySubject.reset();
      scanSpySubject.reset();

      subject.add('b');

      await assert(setSpySubject).toNot.emit();
      await assert(scanSpySubject).toNot.emit();
    });
  });

  test('delete', () => {
    should(`delete the item correctly`, async () => {
      subject.delete('b');

      await assert(setSpySubject).to
          .emitWith(match.anyIterableThat<string, ImmutableSet<string>>().haveElements(['a', 'c']));
      await assert(scanSpySubject).to
          .emitWith(match.anyIterableThat<string, Set<string>>().haveElements(['a', 'c']));
    });

    should(`be noop if the item does not exist`, async () => {
      setSpySubject.reset();
      scanSpySubject.reset();

      subject.delete('d');

      await assert(setSpySubject).toNot.emit();
      await assert(scanSpySubject).toNot.emit();
    });
  });

  test('getDiffs', () => {
    should(`emit correctly`, async () => {
      const spySubject = createSpySubject();
      subject.getDiffs().subscribe(spySubject);

      await assert(spySubject).to.emitWith(match.anyObjectThat().haveProperties({
        payload: match.anyIterableThat().haveElements(['a', 'b', 'c']),
        type: 'init',
      }));

      subject.delete('b');
      await assert(spySubject).to.emitWith(match.anyObjectThat().haveProperties({
        value: 'b',
        type: 'delete',
      }));
    });
  });

  test('setAll', () => {
    should(`set all the items correctly`, async () => {
      subject.setAll(new Set(['e', 'c']));

      await assert(setSpySubject).to
          .emitWith(match.anyIterableThat<string, ImmutableSet<string>>().haveElements(['c', 'e']));
      await assert(scanSpySubject).to
          .emitWith(match.anyIterableThat<string, Set<string>>().haveElements(['c', 'e']));
    });
  });
});
