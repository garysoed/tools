import { assert, createSpySubject, match, setup, should, SpySubject, test } from '@gs-testing';
import { scanArray } from './array-observable';
import { ArraySubject } from './array-subject';

test('@gs-tools/rxjs/array-subject', () => {
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
    should(`delete the item correctly`, async () => {
      subject.deleteAt(1);

      await assert(scanSpySubject).to
          .emitWith(match.anyArrayThat<string>().haveExactElements(['a', 'c']));
    });

    should(`be noop if the item does not exist`, async () => {
      scanSpySubject.reset();

      subject.deleteAt(3);

      await assert(scanSpySubject).toNot.emit();
    });
  });

  test('getDiffs', () => {
    should(`emit correctly`, async () => {
      const spySubject = createSpySubject();
      subject.getDiffs().subscribe(spySubject);

      await assert(spySubject).to.emitWith(match.anyObjectThat().haveProperties({
        value: match.anyArrayThat().haveExactElements(['a', 'b', 'c']),
        type: 'init',
      }));

      subject.deleteAt(1);
      await assert(spySubject).to.emitWith(match.anyObjectThat().haveProperties({
        index: 1,
        type: 'delete',
      }));
    });
  });

  test('insertAt', () => {
    should(`insert the item correctly`, async () => {
      subject.insertAt(0, '0');

      await assert(scanSpySubject).to
          .emitWith(match.anyArrayThat<string>().haveExactElements(['0', 'a', 'b', 'c']));
    });
  });

  test('setAll', () => {
    should(`set all the items correctly`, async () => {
      subject.setAll(['e', 'c']);

      await assert(scanSpySubject).to
          .emitWith(match.anyArrayThat<string>().haveExactElements(['e', 'c']));
    });
  });

  test('setAt', () => {
    should(`set the item correctly`, async () => {
      subject.setAt(1, '1');

      await assert(scanSpySubject).to
          .emitWith(match.anyArrayThat<string>().haveExactElements(['a', '1', 'c']));
    });

    should(`be noop if the item is already set`, async () => {
      scanSpySubject.reset();

      subject.setAt(1, 'b');

      await assert(scanSpySubject).toNot.emit();
    });
  });
});
