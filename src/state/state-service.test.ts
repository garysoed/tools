import {arrayThat, assert, createSpySubject, objectThat, should, test} from 'gs-testing';
import {map} from 'rxjs/operators';

import {IdObject, Snapshot} from './snapshot';
import {createId, StateId} from './state-id';
import {StateService} from './state-service';


test('@tools/state/state-service', init => {
  const _ = init(() => {
    const service = new StateService();
    const onChange$ = createSpySubject(service.onChange$);
    return {onChange$, service};
  });

  test('add', () => {
    should('add the object and give it a unique ID', () => {
      const value = 'value';

      const id = _.service.add<string>(value);

      assert(_.service.resolve(id).self$).to.emitWith(value);
      assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([id.id]);
    });
  });

  test('clear', () => {
    should('delete the objects and return true if it exists', () => {
      const addedId1 = _.service.add<string>('initValue1');
      const addedId2 = _.service.add<string>('initValue2');
      _.service.clear();

      assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([
        // additions
        addedId1.id,
        addedId2.id,
        // deletions
        addedId1.id,
        addedId2.id,
      ]);
      assert(_.service.resolve(addedId1).self$).to.emitWith(undefined);
      assert(_.service.resolve(addedId2).self$).to.emitWith(undefined);
    });
  });

  test('delete', _, init => {
    const _ = init(_ => {
      const addedId = _.service.add<string>('initValue');
      return {..._, addedId};
    });

    should('delete the object and return true if it exists', () => {
      assert(_.service.delete(_.addedId)).to.beTrue();

      assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([_.addedId.id, _.addedId.id]);
      assert(_.service.resolve(_.addedId).self$).to.emitWith(undefined);
    });

    should('return false if the object does not exist', () => {
      const otherId = createId<string>('other');
      assert(_.service.delete(otherId)).to.beFalse();

      assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([_.addedId.id]);
    });
  });

  test('init', () => {
    should('initialize all the values in the service', () => {
      const rootId = createId<string>('root');
      const idA = createId<string>('A');
      const idB = createId<string>('B');
      const idC = createId<string>('C');
      const valueA = 'valueA';
      const valueB = 'valueB';
      const valueC = 'valueC';
      const snapshot = {
        rootId,
        payloads: [
          {id: idA.id, obj: valueA},
          {id: idB.id, obj: valueB},
          {id: idC.id, obj: valueC},
        ],
      };

      _.service.init(snapshot);
      assert(_.service.snapshot(idA)).to.equal(objectThat<Snapshot<string>>().haveProperties({
        rootId: idA,
        payloads: arrayThat<IdObject>().haveExactElements([
          objectThat<IdObject>().haveProperties({id: idA.id, obj: valueA}),
          objectThat<IdObject>().haveProperties({id: idB.id, obj: valueB}),
          objectThat<IdObject>().haveProperties({id: idC.id, obj: valueC}),
        ]),
      }));
      assert(_.service.resolve(idA).self$).to.emitWith(valueA);
    });
  });

  test('resolve', _, init => {
    test('self$', () => {
      const _ = init(_ => {
        const addedValue = 'addedValue';
        const addedId = _.service.add<string>(addedValue);
        return {..._, addedId, addedValue};
      });

      should('emit the correct object if it exists', () => {
        assert(_.service.resolve(_.addedId).self$).to.emitWith(_.addedValue);
      });

      should('emit undefined if the object does not exist', () => {
        assert(_.service.resolve(createId<string>('other')).self$).to.emitWith(undefined);
      });

      should('handle falsy object that are not null', () => {
        _.service.set(_.addedId, '');
        assert(_.service.resolve(_.addedId).self$).to.emitWith('');
      });
    });

    test('_', () => {
      interface Test {
        readonly a: string;
      }

      should('emit the correct property value', () => {
        const addedId = _.service.add<Test>({a: 'abc'});

        assert(_.service.resolve(addedId)._('a')).to.emitWith('abc');
      });

      should('emit undefined if the parent does not exist', () => {
        assert(_.service.resolve(createId<Test>('other'))._('a')).to.emitWith(undefined);
      });
    });

    test('$', () => {
      interface Test {
        readonly a: StateId<string>;
      }

      should('resolve the correct value for sub state ID', () => {
        const addedId = _.service.add<Test>({
          a: _.service.add<string>('abc'),
        });

        assert(_.service.resolve(addedId).$('a').self$).to.emitWith('abc');
      });

      should('emit undefined if the parent does not exist', () => {
        assert(_.service.resolve(createId<Test>('other'))._('a')).to.emitWith(undefined);
      });
    });
  });

  test('set',  _, init => {
    const _ = init(_ => {
      const addedValue = 'addedValue';
      const addedId = _.service.add<string>(addedValue);
      return {..._, addedId, addedValue};
    });

    should('update the value correctly and return true if the ID exist', () => {
      const newValue = 'newValue';
      assert(_.service.set(_.addedId, newValue)).to.beTrue();

      assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([_.addedId.id, _.addedId.id]);
      assert(_.service.resolve(_.addedId).self$).to.emitWith(newValue);
    });

    should('return false if the ID doesn\'t exist', () => {
      const newValue = {value: 'new'};
      const otherId = createId<{value: string}>('otherId');
      assert(_.service.set(otherId, newValue)).to.beFalse();

      assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([_.addedId.id, otherId.id]);
      assert(_.service.resolve(_.addedId).self$).to.emitWith(_.addedValue);
      assert(_.service.resolve(otherId).self$).to.emitWith(newValue);
    });
  });

  test('snapshot', () => {
    should('return all the objects', () => {
      const valueA = 'valueA';
      const valueB = 'valueB';
      const valueC = 'valueC';

      const idA = _.service.add<string>(valueA);
      const idB = _.service.add<string>(valueB);
      const idC = _.service.add<string>(valueC);

      assert(_.service.snapshot(idA)).to.equal(objectThat<Snapshot<string>>().haveProperties({
        rootId: idA,
        payloads: arrayThat<IdObject>().haveExactElements([
          objectThat<IdObject>().haveProperties({id: idA.id, obj: valueA}),
          objectThat<IdObject>().haveProperties({id: idB.id, obj: valueB}),
          objectThat<IdObject>().haveProperties({id: idC.id, obj: valueC}),
        ]),
      }));
    });

    should('return null if the object for the root ID is missing', () => {
      const valueA = 'valueA';
      const valueB = 'valueB';
      const valueC = 'valueC';

      const idA = _.service.add<string>(valueA);
      _.service.add<string>(valueB);
      _.service.add<string>(valueC);

      _.service.delete(idA);

      assert(_.service.snapshot(idA)).to.beNull();
    });
  });
});
