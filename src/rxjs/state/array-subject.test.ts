import { assert, createSpySubject, match, setup, should, SpySubject, test } from '@gs-testing';
import { scanArray } from './array-observable';
import { ArraySubject } from './array-subject';

test('@gs-tools/rxjs/state/array-subject', () => {
  let subject: ArraySubject<string>;
  let scanSpySubject: SpySubject<string[]>;

  setup(() => {
    subject = new ArraySubject(['a', 'b', 'c']);

    scanSpySubject = new SpySubject();
    subject.getDiffs()
        .pipe(scanArray())
        .subscribe(scanSpySubject);
  });

  test('deleteAt', () => {
    should(`delete the item correctly`, () => {
      subject.deleteAt(1);

      assert(scanSpySubject).to
          .emitWith(match.anyArrayThat<string>().haveExactElements(['a', 'c']));
    });

    should(`be noop if the item does not exist`, () => {
      scanSpySubject.reset();

      subject.deleteAt(3);

      assert(scanSpySubject).toNot.emit();
    });
  });

  test('getDiffs', () => {
    should(`emit correctly`, () => {
      const spySubject = createSpySubject();
      subject.getDiffs().subscribe(spySubject);

      assert(spySubject).to.emitWith(match.anyObjectThat().haveProperties({
        type: 'init',
        value: match.anyArrayThat().haveExactElements(['a', 'b', 'c']),
      }));

      subject.deleteAt(1);
      assert(spySubject).to.emitWith(match.anyObjectThat().haveProperties({
        index: 1,
        type: 'delete',
      }));
    });
  });

  test('insertAt', () => {
    should(`insert the item correctly`, () => {
      subject.insertAt(0, '0');

      assert(scanSpySubject).to
          .emitWith(match.anyArrayThat<string>().haveExactElements(['0', 'a', 'b', 'c']));
    });
  });

  test('setAll', () => {
    should(`set all the items correctly`, () => {
      subject.setAll(['e', 'c']);

      assert(scanSpySubject).to
          .emitWith(match.anyArrayThat<string>().haveExactElements(['e', 'c']));
    });
  });

  test('setAt', () => {
    should(`set the item correctly`, () => {
      subject.setAt(1, '1');

      assert(scanSpySubject).to
          .emitWith(match.anyArrayThat<string>().haveExactElements(['a', '1', 'c']));
    });

    should(`be noop if the item is already set`, () => {
      scanSpySubject.reset();

      subject.setAt(1, 'b');

      assert(scanSpySubject).toNot.emit();
    });
  });
});
