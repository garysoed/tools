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

  test('clear', () => {
    should('delete the objects and return true if it exists', () => {
      const [addedId1, addedId2] = _.service.modify(x => {
        return [x.add('initValue1'), x.add('initValue2')];
      });
      _.service.clear();

      assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([
        // additions
        addedId1.id,
        addedId2.id,
        // deletions
        addedId1.id,
        addedId2.id,
      ]);
      assert(_.service.resolve(addedId1)).to.emitWith(undefined);
      assert(_.service.resolve(addedId2)).to.emitWith(undefined);
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
      assert(_.service.resolve(idA)).to.emitWith(valueA);
    });
  });

  test('modify', () => {
    test('add', () => {
      should('add the object and give it a unique ID', () => {
        const value = 'value';

        const id = _.service.modify(x => x.add(value));

        assert(_.service.resolve(id)).to.emitWith(value);
        assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([id.id]);
      });
    });

    test('delete', _, init => {
      const _ = init(_ => {
        const addedId = _.service.modify(x => x.add('initValue'));
        return {..._, addedId};
      });

      should('delete the object and return true if it exists', () => {
        assert(_.service.modify(x => x.delete(_.addedId))).to.beTrue();

        assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([_.addedId.id, _.addedId.id]);
        assert(_.service.resolve(_.addedId)).to.emitWith(undefined);
      });

      should('return false if the object does not exist', () => {
        const otherId = createId<string>('other');
        assert(_.service.modify(x => x.delete(otherId))).to.beFalse();

        assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([_.addedId.id]);
      });
    });

    test('set',  _, init => {
      const _ = init(_ => {
        const addedValue = 'addedValue';
        const addedId = _.service.modify(x => x.add(addedValue));
        return {..._, addedId, addedValue};
      });

      should('update the value correctly and return true if the ID exist', () => {
        const newValue = 'newValue';
        assert(_.service.modify(x => x.set(_.addedId, newValue))).to.beTrue();

        assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([_.addedId.id, _.addedId.id]);
        assert(_.service.resolve(_.addedId)).to.emitWith(newValue);
      });

      should('return false if the ID doesn\'t exist', () => {
        const newValue = {value: 'new'};
        const otherId = createId<{value: string}>('otherId');
        assert(_.service.modify(x => x.set(otherId, newValue))).to.beFalse();

        assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([_.addedId.id, otherId.id]);
        assert(_.service.resolve(_.addedId)).to.emitWith(_.addedValue);
        assert(_.service.resolve(otherId)).to.emitWith(newValue);
      });
    });

    should.only(`make all the changes in one transaction`);
  });

  test('resolve', _, init => {
    test('self$', () => {
      const _ = init(_ => {
        const addedValue = 'addedValue';
        const addedId = _.service.modify(x => x.add(addedValue));
        return {..._, addedId, addedValue};
      });

      should('emit the correct object if it exists', () => {
        assert(_.service.resolve(_.addedId)).to.emitWith(_.addedValue);
      });

      should('emit undefined if the object does not exist', () => {
        assert(_.service.resolve(createId<string>('other'))).to.emitWith(undefined);
      });

      should('handle falsy object that are not null', () => {
        _.service.modify(x => x.set(_.addedId, ''));
        assert(_.service.resolve(_.addedId)).to.emitWith('');
      });
    });

    test('_', () => {
      interface Test {
        readonly a: string;
      }

      should('emit the correct property value', () => {
        const addedId = _.service.modify(x => x.add({a: 'abc'}));

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
        const addedId = _.service.modify(x => x.add({
          a: x.add('abc'),
        }));

        assert(_.service.resolve(addedId).$('a')).to.emitWith('abc');
      });

      should('emit undefined if the parent does not exist', () => {
        assert(_.service.resolve(createId<Test>('other'))._('a')).to.emitWith(undefined);
      });
    });
  });

  test('snapshot', () => {
    should('return all the objects', () => {
      const valueA = 'valueA';
      const valueB = 'valueB';
      const valueC = 'valueC';

      const [idA, idB, idC] = _.service.modify(x => {
        return [x.add(valueA), x.add(valueB), x.add(valueC)];
      });

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

      const [idA] = _.service.modify(x => {
        const ids = [x.add(valueA), x.add(valueB), x.add(valueC)];
        x.delete(ids[0]);
        return ids;
      });

      assert(_.service.snapshot(idA)).to.beNull();
    });
  });
});
