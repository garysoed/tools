import {assert, createSpySubject, run, should, test} from 'gs-testing';
import {BehaviorSubject, of} from 'rxjs';

import {walkObservable} from './observable-walker';

test('@tools/src/rxjs/observable-walker', () => {
  test('_', () => {
    should('emit the correct property value', () => {
      const walker = walkObservable(of({a: 'abc'}));

      assert(walker._('a')).to.emitWith('abc');
    });

    should('handle Subjects', () => {
      const walker = walkObservable(of({
        a: new BehaviorSubject({
          b: {c: new BehaviorSubject(12)},
        }),
      }));

      const cWalker = walker.$('a')._('b').$('c');
      const c$ = createSpySubject(cWalker);
      run(of(34).pipe(cWalker.set()));

      assert(c$).to.emitSequence([12, 34]);
    });
  });

  test('$', () => {
    should('emit the values in the path pointed by the object path', () => {
      const walker = walkObservable(of({
        a: new BehaviorSubject({
          b: {c: new BehaviorSubject(12)},
        }),
      }));

      const cWalker = walker.$('a')._('b').$('c');
      const c$ = createSpySubject(cWalker);
      run(of(34).pipe(cWalker.set()));

      assert(c$).to.emitSequence([12, 34]);

      // Try overriding the entire tree. c should also be updated
      run(of({b: {c: new BehaviorSubject(56)}}).pipe(walker.$('a').set()));

      assert(c$).to.emitSequence([12, 34, 56]);
    });

    should('handle Subject root objects', () => {
      const walker = walkObservable(new BehaviorSubject(12));

      const root$ = createSpySubject(walker);
      run(of(34).pipe(walker.set()));

      assert(root$).to.emitSequence([12, 34]);
    });
  });

  test('set', () => {
    should('update the value of the subject', () => {
      const walker = walkObservable(of({
        a: new BehaviorSubject('abc'),
      }));

      const a$ = createSpySubject(walker.$('a'));
      run(of('xyz').pipe(walker.$('a').set()));

      assert(a$).to.emitSequence(['abc', 'xyz']);
    });
  });
});