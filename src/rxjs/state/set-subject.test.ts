import { assert, createSpySubject, iterableThat, objectThat, setThat, should, test } from 'gs-testing';
import { scan } from 'rxjs/operators';

import { scanSet, SetDiff } from './set-observable';
import { SetSubject } from './set-subject';


test('@gs-tools/rxjs/state/set-subject', init => {
  const _ = init(() => {
    const subject = new SetSubject(['a', 'b', 'c']);

    const setSpySubject = createSpySubject(subject.pipe(scanSet()));

    const scan$ = subject
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
        );
    const scanSpySubject = createSpySubject(scan$);
    return {subject, setSpySubject, scanSpySubject};
  });

  test('add', () => {
    should(`set the item correctly`, () => {
      _.subject.add('d');

      assert(_.setSpySubject).to.emitWith(
          setThat<string>().haveExactElements(new Set(['a', 'b', 'c', 'd'])));
      assert(_.scanSpySubject).to.emitWith(
          setThat<string>().haveExactElements(new Set(['a', 'b', 'c', 'd'])));
    });

    should(`be noop if the item is already in the set`, () => {
      _.subject.add('b');

      assert(_.setSpySubject).to.emitWith(
          setThat<string>().haveExactElements(new Set(['a', 'b', 'c'])));
      assert(_.scanSpySubject).to.emitWith(
          setThat<string>().haveExactElements(new Set(['a', 'b', 'c'])));
    });
  });

  test('delete', () => {
    should(`delete the item correctly`, () => {
      _.subject.delete('b');

      assert(_.setSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['a', 'c'])));
      assert(_.scanSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['a', 'c'])));
    });

    should(`be noop if the item does not exist`, () => {
      _.subject.delete('d');

      assert(_.setSpySubject).to.emitWith(
          setThat<string>().haveExactElements(new Set(['a', 'b', 'c'])));
      assert(_.scanSpySubject).to.emitWith(
          setThat<string>().haveExactElements(new Set(['a', 'b', 'c'])));
    });
  });

  test('getDiffs', () => {
    should(`emit correctly`, () => {
      const spySubject = createSpySubject(_.subject);

      assert(spySubject).to.emitWith(objectThat<SetDiff<string>>().haveProperties({
        type: 'init',
        value: setThat<string>().haveExactElements(new Set(['a', 'b', 'c'])),
      }));

      _.subject.delete('b');
      assert(spySubject).to.emitWith(objectThat<SetDiff<string>>().haveProperties({
        type: 'delete',
        value: 'b',
      }));
    });
  });

  test('next', () => {
    should(`handle add correctly`, () => {
      _.subject.next({type: 'add', value: 'd'});

      assert(_.setSpySubject).to.emitWith(
          setThat<string>().haveExactElements(new Set(['a', 'b', 'c', 'd'])));
      assert(_.scanSpySubject).to.emitWith(
          setThat<string>().haveExactElements(new Set(['a', 'b', 'c', 'd'])));
    });

    should(`handle delete correctly`, () => {
      _.subject.next({type: 'delete', value: 'b'});

      assert(_.setSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['a', 'c'])));
      assert(_.scanSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['a', 'c'])));
    });

    should(`handle init correctly`, () => {
      _.subject.next({type: 'init', value: new Set(['e', 'c'])});

      assert(_.setSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['c', 'e'])));
      assert(_.scanSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['c', 'e'])));
    });
  });

  test('setAll', () => {
    should(`set all the items correctly`, () => {
      _.subject.setAll(new Set(['e', 'c']));

      assert(_.setSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['c', 'e'])));
      assert(_.scanSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['c', 'e'])));
    });
  });
});
