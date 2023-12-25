import {asyncAssert, createSpySubject, run, should, test} from 'gs-testing';
import {BehaviorSubject, of} from 'rxjs';

import {walkObservable} from './observable-walker';

test('@tools/src/rxjs/observable-walker', () => {
  test('_', () => {
    should('emit the correct property value', async () => {
      const walker = walkObservable(of({a: 'abc'}));

      await asyncAssert(walker._('a')).to.emitWith('abc');
    });

    should('handle Subjects', async () => {
      const walker = walkObservable(of({
        a: new BehaviorSubject({
          b: {c: new BehaviorSubject(12)},
        }),
      }));

      const cWalker = walker.$('a')._('b').$('c');
      const c$ = createSpySubject(cWalker);
      run(of(34).pipe(cWalker.set()));

      await asyncAssert(c$).to.emitSequence([12, 34]);
    });
  });

  test('$', () => {
    should('emit the values in the path pointed by the object path', async () => {
      const walker = walkObservable(of({
        a: new BehaviorSubject({
          b: {c: new BehaviorSubject(12)},
        }),
      }));

      const cWalker = walker.$('a')._('b').$('c');
      const c$ = createSpySubject(cWalker);
      run(of(34).pipe(cWalker.set()));

      await asyncAssert(c$).to.emitSequence([12, 34]);

      // Try overriding the entire tree. c should also be updated
      run(of({b: {c: new BehaviorSubject(56)}}).pipe(walker.$('a').set()));

      await asyncAssert(c$).to.emitSequence([12, 34, 56]);
    });

    should('handle Subject root objects', async () => {
      const walker = walkObservable(new BehaviorSubject(12));

      const root$ = createSpySubject(walker);
      run(of(34).pipe(walker.set()));

      await asyncAssert(root$).to.emitSequence([12, 34]);
    });
  });

  test('set', () => {
    should('update the value of the subject', async () => {
      const walker = walkObservable(of({
        a: new BehaviorSubject('abc'),
      }));

      const a$ = createSpySubject(walker.$('a'));
      run(of('xyz').pipe(walker.$('a').set()));

      await asyncAssert(a$).to.emitSequence(['abc', 'xyz']);
    });
  });
});