import { arrayThat, assert, createSpySubject, objectThat, setup, should, SpySubject, test } from 'gs-testing';

import { scanArray } from './array-observable';
import { ArraySubject } from './array-subject';

test('@gs-tools/rxjs/state/array-subject', () => {
  let subject: ArraySubject<string>;
  let scanSpySubject: SpySubject<ReadonlyArray<string>>;

  setup(() => {
    subject = new ArraySubject(['a', 'b', 'c']);

    scanSpySubject = new SpySubject();
    subject
        .pipe(scanArray())
        .subscribe(scanSpySubject);
  });

  test('deleteAt', () => {
    should(`delete the item correctly`, () => {
      subject.deleteAt(1);

      assert(scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['a', 'c']));
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
      subject.subscribe(spySubject);

      assert(spySubject).to.emitWith(objectThat().haveProperties({
        type: 'init',
        value: arrayThat().haveExactElements(['a', 'b', 'c']),
      }));

      subject.deleteAt(1);
      assert(spySubject).to.emitWith(objectThat().haveProperties({
        index: 1,
        type: 'delete',
      }));
    });
  });

  test('insertAt', () => {
    should(`insert the item correctly`, () => {
      subject.insertAt(0, '0');

      assert(scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['0', 'a', 'b', 'c']));
    });
  });

  test('next', () => {
    should(`handle delete correctly`, () => {
      subject.next({type: 'delete', index: 1, value: 'b'});

      assert(scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['a', 'c']));
    });

    should(`handle init correctly`, () => {
      subject.next({type: 'init', value: ['e', 'c']});

      assert(scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['e', 'c']));
    });

    should(`handle insert correctly`, () => {
      subject.next({type: 'insert', index: 0, value: '0'});

      assert(scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['0', 'a', 'b', 'c']));
    });

    should(`handle set correctly`, () => {
      subject.next({type: 'set', index: 1, value: '1'});

      assert(scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['a', '1', 'c']));
    });
  });

  test('setAll', () => {
    should(`set all the items correctly`, () => {
      subject.setAll(['e', 'c']);

      assert(scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['e', 'c']));
    });
  });

  test('setAt', () => {
    should(`set the item correctly`, () => {
      subject.setAt(1, '1');

      assert(scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['a', '1', 'c']));
    });

    should(`be noop if the item is already set`, () => {
      scanSpySubject.reset();

      subject.setAt(1, 'b');

      assert(scanSpySubject).toNot.emit();
    });
  });
});
