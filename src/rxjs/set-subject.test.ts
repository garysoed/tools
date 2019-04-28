import { assert, match, setup, should, test } from '@gs-testing';
import { createSpySubject, SpySubject } from '@gs-testing';
import { scan } from '@rxjs/operators';
import { ImmutableSet } from '../collect/types/immutable-set';
import { SetDiff, scanSet } from './set-observable';
import { SetSubject } from './set-subject';

test('gs-tools.rxjs.SetSubject', () => {
  let subject: SetSubject<string>;
  let setSpySubject: SpySubject<Set<string>>;
  let scanSpySubject: SpySubject<Set<string>>;

  setup(() => {
    subject = new SetSubject(['a', 'b', 'c']);

    setSpySubject = new SpySubject();
    subject.getDiffs().pipe(scanSet()).subscribe(setSpySubject);

    scanSpySubject = new SpySubject();
    subject.getDiffs()
        .pipe(
            scan<SetDiff<string>, Set<string>>(
                (acc, diff) => {
                  switch (diff.type) {
                    case 'add':
                      acc.add(diff.value);

                      return acc;
                    case 'delete':
                      acc.delete(diff.value);

                      return acc;
                    case 'init':
                      return diff.value;
                  }
                },
                new Set()),
        )
        .subscribe(scanSpySubject);
  });

  test('add', () => {
    should(`set the item correctly`, async () => {
      subject.add('d');

      await assert(setSpySubject).to.emitWith(
          match.anyIterableThat<string, Set<string>>().haveElements(['a', 'b', 'c', 'd']));
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
          .emitWith(match.anyIterableThat<string, Set<string>>().haveElements(['a', 'c']));
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
        type: 'delete',
        value: 'b',
      }));
    });
  });

  test('setAll', () => {
    should(`set all the items correctly`, async () => {
      subject.setAll(new Set(['e', 'c']));

      await assert(setSpySubject).to
          .emitWith(match.anyIterableThat<string, Set<string>>().haveElements(['c', 'e']));
      await assert(scanSpySubject).to
          .emitWith(match.anyIterableThat<string, Set<string>>().haveElements(['c', 'e']));
    });
  });
});
