import {assert, createSpySubject, run, should, test} from 'gs-testing';
import {of} from 'rxjs';

import {mutableState, MutableState} from './mutable-state';
import {createRootStateId} from './root-state-id';
import {StateService} from './state-service';


test('@tools/state/state-service', init => {
  const _ = init(() => {
    const service = new StateService();
    return {service};
  });

  test('addRoot', () => {
    should('add the object and give it a unique ID', () => {
      const value = 'value';

      const id = _.service.addRoot(value);

      assert(_.service._(id)).to.emitWith(value);
    });
  });

  test('resolveRoot', _, () => {
    test('_', () => {
      interface Test {
        readonly a: string;
      }

      should('emit the correct property value', () => {
        const addedId = _.service.addRoot({a: 'abc'});

        assert(_.service._(addedId)._('a')).to.emitWith('abc');
      });

      should('emit undefined if the parent does not exist', () => {
        assert(_.service._(createRootStateId<Test>('other'))._('a')).to.emitWith(undefined);
      });
    });

    test('$get', () => {
      interface Test {
        readonly a: MutableState<string>;
      }

      should('resolve the correct value for sub state ID', () => {
        const addedId = _.service.addRoot({
          a: mutableState('abc'),
        });

        assert(_.service._(addedId).$('a')).to.emitWith('abc');
      });

      should('emit undefined if the parent does not exist', () => {
        assert(_.service._(createRootStateId<Test>('other'))._('a')).to.emitWith(undefined);
      });
    });

    test('$set', () => {
      should('update the value of the mutable state', () => {
        const addedId = _.service.addRoot({
          a: mutableState('abc'),
        });

        const a$ = createSpySubject(_.service._(addedId).$('a'));
        run(of('xyz').pipe(_.service._(addedId).$('a').set()));

        assert(a$).to.emitSequence(['abc', 'xyz']);
      });
    });
  });

  test('resolveMutable', () => {
    should('emit the values in the path pointed by the object path', () => {
      const rootId = _.service.addRoot({
        a: mutableState({
          b: {c: mutableState(12)},
        }),
      });

      const path = _.service.mutablePath(rootId, root => {
        const rv = root.$('a')._('b')._('c');
        return rv;
      });

      const c$ = createSpySubject(_.service.$(path));
      run(of(34).pipe(_.service._(rootId).$('a')._('b').$('c').set()));

      assert(c$).to.emitSequence([12, 34]);

      // Try overriding the entire tree. c should also be updated
      run(of({b: {c: mutableState(56)}}).pipe(_.service._(rootId).$('a').set()));

      assert(c$).to.emitSequence([12, 34, 56]);
    });

    should('handle mutable root IDs', () => {
      const rootId = _.service.addRoot(mutableState(12));

      const root$ = createSpySubject(_.service.$(rootId));
      run(of(34).pipe(_.service.$(rootId).set()));

      assert(root$).to.emitSequence([12, 34]);
    });
  });
});
