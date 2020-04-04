import { arrayThat, assert, createSpySubject, objectThat, should, test } from 'gs-testing';

import { ArrayDiff, scanArray } from './array-observable';
import { ArraySubject } from './array-subject';

test('@gs-tools/rxjs/state/array-subject', init => {
  const _ = init(() => {
    const subject = new ArraySubject(['a', 'b', 'c']);

    const scanSpySubject = createSpySubject(subject.pipe(scanArray()));

    return {subject, scanSpySubject};
  });

  test('deleteAt', () => {
    should(`delete the item correctly`, () => {
      _.subject.deleteAt(1);

      assert(_.scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['a', 'c']));
    });

    should(`be noop if the item does not exist`, () => {
      _.subject.deleteAt(3);

      assert(_.scanSpySubject).to.emitSequence([
        arrayThat<string>().haveExactElements(['a', 'b', 'c']),
      ]);
    });
  });

  test('getDiffs', () => {
    should(`emit correctly`, () => {
      const spySubject = createSpySubject(_.subject);

      assert(spySubject).to.emitWith(objectThat<ArrayDiff<string>>().haveProperties({
        type: 'init',
        value: arrayThat().haveExactElements(['a', 'b', 'c']),
      }));

      _.subject.deleteAt(1);
      assert(spySubject).to.emitWith(objectThat<ArrayDiff<string>>().haveProperties({
        index: 1,
        type: 'delete',
      }));
    });
  });

  test('insertAt', () => {
    should(`insert the item correctly`, () => {
      _.subject.insertAt(0, '0');

      assert(_.scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['0', 'a', 'b', 'c']));
    });
  });

  test('next', () => {
    should(`handle delete correctly`, () => {
      _.subject.next({type: 'delete', index: 1, value: 'b'});

      assert(_.scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['a', 'c']));
    });

    should(`handle init correctly`, () => {
      _.subject.next({type: 'init', value: ['e', 'c']});

      assert(_.scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['e', 'c']));
    });

    should(`handle insert correctly`, () => {
      _.subject.next({type: 'insert', index: 0, value: '0'});

      assert(_.scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['0', 'a', 'b', 'c']));
    });

    should(`handle set correctly`, () => {
      _.subject.next({type: 'set', index: 1, value: '1'});

      assert(_.scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['a', '1', 'c']));
    });
  });

  test('setAll', () => {
    should(`set all the items correctly`, () => {
      _.subject.setAll(['e', 'c']);

      assert(_.scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['e', 'c']));
    });
  });

  test('setAt', () => {
    should(`set the item correctly`, () => {
      _.subject.setAt(1, '1');

      assert(_.scanSpySubject).to
          .emitWith(arrayThat<string>().haveExactElements(['a', '1', 'c']));
    });

    should(`be noop if the item is already set`, () => {
      _.subject.setAt(1, 'b');

      assert(_.scanSpySubject).to.emitSequence([
        arrayThat<string>().haveExactElements(['a', 'b', 'c']),
      ]);
    });
  });
});
