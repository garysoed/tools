import { assert, createSpySubject, match, setup, should, SpySubject, test } from '@gs-testing';
import { scan } from '@rxjs/operators';
import { scanSet, SetDiff } from './set-observable';
import { SetSubject } from './set-subject';

test('@gs-tools/rxjs/set-subject', () => {
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
    should(`set the item correctly`, () => {
      subject.add('d');

      assert(setSpySubject).to.emitWith(
          match.anyIterableThat<string, Set<string>>().haveElements(['a', 'b', 'c', 'd']));
      assert(scanSpySubject).to.emitWith(
          match.anyIterableThat<string, Set<string>>().haveElements(['a', 'b', 'c', 'd']));
    });

    should(`be noop if the item is already in the set`, () => {
      setSpySubject.reset();
      scanSpySubject.reset();

      subject.add('b');

      assert(setSpySubject).toNot.emit();
      assert(scanSpySubject).toNot.emit();
    });
  });

  test('delete', () => {
    should(`delete the item correctly`, () => {
      subject.delete('b');

      assert(setSpySubject).to
          .emitWith(match.anyIterableThat<string, Set<string>>().haveElements(['a', 'c']));
      assert(scanSpySubject).to
          .emitWith(match.anyIterableThat<string, Set<string>>().haveElements(['a', 'c']));
    });

    should(`be noop if the item does not exist`, () => {
      setSpySubject.reset();
      scanSpySubject.reset();

      subject.delete('d');

      assert(setSpySubject).toNot.emit();
      assert(scanSpySubject).toNot.emit();
    });
  });

  test('getDiffs', () => {
    should(`emit correctly`, () => {
      const spySubject = createSpySubject();
      subject.getDiffs().subscribe(spySubject);

      assert(spySubject).to.emitWith(match.anyObjectThat().haveProperties({
        type: 'init',
        value: match.anyIterableThat().haveElements(['a', 'b', 'c']),
      }));

      subject.delete('b');
      assert(spySubject).to.emitWith(match.anyObjectThat().haveProperties({
        type: 'delete',
        value: 'b',
      }));
    });
  });

  test('setAll', () => {
    should(`set all the items correctly`, () => {
      subject.setAll(new Set(['e', 'c']));

      assert(setSpySubject).to
          .emitWith(match.anyIterableThat<string, Set<string>>().haveElements(['c', 'e']));
      assert(scanSpySubject).to
          .emitWith(match.anyIterableThat<string, Set<string>>().haveElements(['c', 'e']));
    });
  });
});
