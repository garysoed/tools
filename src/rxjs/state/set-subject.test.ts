import {asyncAssert, setThat, should, test} from 'gs-testing';

import {SetSubject} from './set-subject';

test('@tools/src/rxjs/state/set-subject', () => {
  test('add', () => {
    should('update the set correctly', async () => {
      const set$ = new SetSubject(new Set([1, 2, 3]));
      set$.add(4);
      await asyncAssert(set$).to.emitWith(
        setThat<number>().haveExactElements(new Set([1, 2, 3, 4])),
      );
    });
  });

  test('delete', () => {
    should('update the set correctly', async () => {
      const set$ = new SetSubject(new Set([1, 2, 3]));
      set$.delete(2);
      await asyncAssert(set$).to.emitWith(
        setThat<number>().haveExactElements(new Set([1, 3])),
      );
    });
  });

  test('has', () => {
    should('return the true if the value exists', async () => {
      const set$ = new SetSubject(new Set([1, 2, 3]));
      await asyncAssert(set$.has(2)).to.emitWith(true);
    });

    should("return undefined if the key doesn't exist", async () => {
      const set$ = new SetSubject(new Set([1, 2, 3]));
      await asyncAssert(set$.has(5)).to.emitWith(false);
    });
  });
});
