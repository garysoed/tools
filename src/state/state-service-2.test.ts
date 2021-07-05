import {assert, createSpySubject, run, should, test} from 'gs-testing';
import {of} from 'rxjs';

import {createRootStateId, MutableState, mutableState, StateService2} from './state-service-2';


test('@tools/state/state-service-2', init => {
  const _ = init(() => {
    const service = new StateService2();
    return {service};
  });

  test('addRoot', () => {
    should('add the object and give it a unique ID', () => {
      const value = 'value';

      const id = _.service.addRoot(value);

      assert(_.service.resolve(id)).to.emitWith(value);
    });
  });

  test('resolve', _, () => {
    test('_', () => {
      interface Test {
        readonly a: string;
      }

      should('emit the correct property value', () => {
        const addedId = _.service.addRoot({a: 'abc'});

        assert(_.service.resolve(addedId)._('a')).to.emitWith('abc');
      });

      should('emit undefined if the parent does not exist', () => {
        assert(_.service.resolve(createRootStateId<Test>('other'))._('a')).to.emitWith(undefined);
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

        assert(_.service.resolve(addedId).$get('a')).to.emitWith('abc');
      });

      should('emit undefined if the parent does not exist', () => {
        assert(_.service.resolve(createRootStateId<Test>('other'))._('a')).to.emitWith(undefined);
      });
    });

    test('$set', () => {
      should('update the value of the mutable state', () => {
        const addedId = _.service.addRoot({
          a: mutableState('abc'),
        });

        const a$ = createSpySubject(_.service.resolve(addedId).$get('a'));
        run(of('xyz').pipe(_.service.resolve(addedId).$set('a')));

        assert(a$).to.emitSequence(['abc', 'xyz']);
      });
    });

    test('objectPath', () => {
      should('emit the values in the path pointed by the object path', () => {
        const rootId = _.service.addRoot({
          a: mutableState({
            b: {c: 12},
          }),
        });

        const path = _.service.objectPath(rootId, root => root.$get('a')._('b')._('c'));

        const b$ = createSpySubject(_.service.resolve(path));
        run(of({b: {c: 34}}).pipe(_.service.resolve(rootId).$set('a')));

        assert(b$).to.emitSequence([12, 34]);
      });
    });
  });
});