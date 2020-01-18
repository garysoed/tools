import { assert, createSpySubject, iterableThat, objectThat, setThat, setup, should, SpySubject, test } from '@gs-testing';
import { scan } from '@rxjs/operators';

import { scanSet, SetDiff } from './set-observable';
import { SetSubject } from './set-subject';

test('@gs-tools/rxjs/state/set-subject', () => {
  let subject: SetSubject<string>;
  let setSpySubject: SpySubject<ReadonlySet<string>>;
  let scanSpySubject: SpySubject<ReadonlySet<string>>;

  setup(() => {
    subject = new SetSubject(['a', 'b', 'c']);

    setSpySubject = new SpySubject();
    subject.pipe(scanSet()).subscribe(setSpySubject);

    scanSpySubject = new SpySubject();
    subject
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
          setThat<string>().haveExactElements(new Set(['a', 'b', 'c', 'd'])));
      assert(scanSpySubject).to.emitWith(
          setThat<string>().haveExactElements(new Set(['a', 'b', 'c', 'd'])));
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
          .emitWith(setThat<string>().haveExactElements(new Set(['a', 'c'])));
      assert(scanSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['a', 'c'])));
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
      subject.subscribe(spySubject);

      assert(spySubject).to.emitWith(objectThat().haveProperties({
        type: 'init',
        value: iterableThat().startWith(['a', 'b', 'c']),
      }));

      subject.delete('b');
      assert(spySubject).to.emitWith(objectThat().haveProperties({
        type: 'delete',
        value: 'b',
      }));
    });
  });

  test('next', () => {
    should(`handle add correctly`, () => {
      subject.next({type: 'add', value: 'd'});

      assert(setSpySubject).to.emitWith(
          setThat<string>().haveExactElements(new Set(['a', 'b', 'c', 'd'])));
      assert(scanSpySubject).to.emitWith(
          setThat<string>().haveExactElements(new Set(['a', 'b', 'c', 'd'])));
    });

    should(`handle delete correctly`, () => {
      subject.next({type: 'delete', value: 'b'});

      assert(setSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['a', 'c'])));
      assert(scanSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['a', 'c'])));
    });

    should(`handle init correctly`, () => {
      subject.next({type: 'init', value: new Set(['e', 'c'])});

      assert(setSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['c', 'e'])));
      assert(scanSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['c', 'e'])));
    });
  });

  test('setAll', () => {
    should(`set all the items correctly`, () => {
      subject.setAll(new Set(['e', 'c']));

      assert(setSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['c', 'e'])));
      assert(scanSpySubject).to
          .emitWith(setThat<string>().haveExactElements(new Set(['c', 'e'])));
    });
  });
});
