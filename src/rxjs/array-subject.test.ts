import { test, should, setup, assert, match } from '@gs-testing/main';
import { ArraySubject } from './array-subject';
import { scan } from 'rxjs/operators';
import { SpySubject, createSpySubject } from '@gs-testing/spy';
import { ImmutableList } from '../collect/types/immutable-list';
import { ArrayDiff } from './array-observable';

test('gs-tools.rxjs.ArraySubject', () => {
  let subject: ArraySubject<string>;
  let arraySpySubject: SpySubject<ImmutableList<string>>;
  let scanSpySubject: SpySubject<string[]>;

  setup(() => {
    subject = new ArraySubject(['a', 'b', 'c']);

    arraySpySubject = new SpySubject();
    subject.getObs().subscribe(arraySpySubject);

    scanSpySubject = new SpySubject();
    subject.getDiffs()
        .pipe(
            scan<ArrayDiff<string>, string[]>((acc, diff) => {
              switch (diff.type) {
                case 'delete':
                  acc.splice(diff.index, 1);
                  return acc;
                case 'init':
                  return diff.payload;
                case 'insert':
                  acc.splice(diff.index, 0, diff.payload);
                  return acc;
                case 'set':
                  acc[diff.index] = diff.payload;
                  return acc;
              }
            }, [] as string[]),
        )
        .subscribe(scanSpySubject);
  });

  test('deleteAt', () => {
    should(`delete the item correctly`, async () => {
      subject.deleteAt(1);

      await assert(arraySpySubject).to
          .emitWith(match.anyIterableThat<string, ImmutableList<string>>().startWith(['a', 'c']));
      await assert(scanSpySubject).to
          .emitWith(match.anyArrayThat<string>().haveExactElements(['a', 'c']));
    });

    should(`be noop if the item does not exist`, async () => {
      arraySpySubject.reset();
      scanSpySubject.reset();

      subject.deleteAt(3);

      await assert(arraySpySubject).toNot.emit();
      await assert(scanSpySubject).toNot.emit();
    });
  });

  test('getDiffs', () => {
    should(`emit correctly`, async () => {
      const spySubject = createSpySubject();
      subject.getDiffs().subscribe(spySubject);

      await assert(spySubject).to.emitWith(match.anyObjectThat().haveProperties({
        payload: match.anyArrayThat().haveExactElements(['a', 'b', 'c']),
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

      await assert(arraySpySubject).to.emitWith(
          match.anyIterableThat<string, ImmutableList<string>>().startWith(['0', 'a', 'b', 'c']));
      await assert(scanSpySubject).to
          .emitWith(match.anyArrayThat<string>().haveExactElements(['0', 'a', 'b', 'c']));
    });
  });

  test('setAll', () => {
    should(`set all the items correctly`, async () => {
      subject.setAll(['e', 'c']);

      await assert(arraySpySubject).to.emitWith(
          match.anyIterableThat<string, ImmutableList<string>>().startWith(['e', 'c']));
      await assert(scanSpySubject).to
          .emitWith(match.anyArrayThat<string>().haveExactElements(['e', 'c']));
    });
  });

  test('setAt', () => {
    should(`set the item correctly`, async () => {
      subject.setAt(1, '1');

      await assert(arraySpySubject).to.emitWith(
          match.anyIterableThat<string, ImmutableList<string>>().startWith(['a', '1', 'c']));
      await assert(scanSpySubject).to
          .emitWith(match.anyArrayThat<string>().haveExactElements(['a', '1', 'c']));
    });

    should(`be noop if the item is already set`, async () => {
      arraySpySubject.reset();
      scanSpySubject.reset();

      subject.setAt(1, 'b');

      await assert(arraySpySubject).toNot.emit();
      await assert(scanSpySubject).toNot.emit();
    });
  });
});
