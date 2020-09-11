import { arrayThat, assert, createSpySubject, objectThat, should, test } from 'gs-testing';

import { IdObject, Snapshot } from './snapshot';
import { StateService } from './state-service';


test('@tools/state/state-service', init => {
  interface Test {
    readonly value: string;
  }

  const _ = init(() => {
    const service = new StateService();
    const onChange$ = createSpySubject(service.onChange$);
    return {onChange$, service};
  });

  test('add', () => {
    should(`add the object and give it a unique ID`, () => {
      const addedObject = {value: 'value'};

      const id = _.service.add<Test>(addedObject);

      assert(_.service.get(id)).to.emitWith(addedObject);
      assert(_.onChange$).to.emitSequence([id]);
    });
  });

  test('delete', _, init => {
    const _ = init(_ => {
      const addedId = _.service.add<Test>({value: 'value'});
      return {..._, addedId};
    });

    should(`delete the object and return true if it exists`, () => {
      assert(_.service.delete(_.addedId)).to.beTrue();

      assert(_.onChange$).to.emitSequence([_.addedId, _.addedId]);
      assert(_.service.get(_.addedId)).to.emitWith(null);
    });

    should(`return false if the object does not exist`, () => {
      const otherId = {id: 'other'};
      assert(_.service.delete(otherId)).to.beFalse();

      assert(_.onChange$).to.emitSequence([_.addedId]);
    });
  });

  test('get', _, init => {
    const _ = init(_ => {
      const addedObject = {value: 'value'};
      const addedId = _.service.add<Test>(addedObject);
      return {..._, addedId, addedObject};
    });

    should(`emit the correct object if it exists`, () => {
      assert(_.service.get(_.addedId)).to.emitWith(_.addedObject);
    });

    should(`emit null if the object does not exist`, () => {
      assert(_.service.get({id: 'other'})).to.emitWith(null);
    });
  });

  test('init', () => {
    should(`initialize all the values in the service`, () => {
      const rootId = {id: 'root'};
      const idA = {id: 'A'};
      const idB = {id: 'B'};
      const idC = {id: 'C'};
      const objA = {value: 'a'};
      const objB = {value: 'b'};
      const objC = {value: 'c'};
      const snapshot = {
        rootId,
        payloads: [
          {id: idA, obj: objA},
          {id: idB, obj: objB},
          {id: idC, obj: objC},
        ],
      };

      _.service.init(snapshot);
      assert(_.service.snapshot(idA)).to.equal(objectThat<Snapshot<Test>>().haveProperties({
        rootId: idA,
        payloads: arrayThat<IdObject>().haveExactElements([
          objectThat<IdObject>().haveProperties({id: idA, obj: objA}),
          objectThat<IdObject>().haveProperties({id: idB, obj: objB}),
          objectThat<IdObject>().haveProperties({id: idC, obj: objC}),
        ]),
      }));
      assert(_.service.get(idA)).to.emitWith(objA);
    });
  });

  test('set',  _, init => {
    const _ = init(_ => {
      const addedObject = {value: 'value'};
      const addedId = _.service.add<Test>(addedObject);
      return {..._, addedId, addedObject};
    });

    should(`update the value correctly and return true if the ID exist`, () => {
      const newValue = {value: 'new'};
      assert(_.service.set(_.addedId, newValue)).to.beTrue();

      assert(_.onChange$).to.emitSequence([_.addedId, _.addedId]);
      assert(_.service.get(_.addedId)).to.emitWith(newValue);
    });

    should(`return false if the ID doesn't exist`, () => {
      const newValue = {value: 'new'};
      const otherId = {id: 'otherId'};
      assert(_.service.set(otherId, newValue)).to.beFalse();

      assert(_.onChange$).to.emitSequence([_.addedId, otherId]);
      assert(_.service.get(_.addedId)).to.emitWith(_.addedObject);
      assert(_.service.get(otherId)).to.emitWith(newValue);
    });
  });

  test('snapshot', () => {
    should(`return all the objects`, () => {
      const addedA = {value: 'a'};
      const addedB = {value: 'b'};
      const addedC = {value: 'c'};

      const idA = _.service.add<Test>(addedA);
      const idB = _.service.add<Test>(addedB);
      const idC = _.service.add<Test>(addedC);

      assert(_.service.snapshot(idA)).to.equal(objectThat<Snapshot<{}>>().haveProperties({
        rootId: idA,
        payloads: arrayThat<IdObject>().haveExactElements([
          objectThat<IdObject>().haveProperties({id: idA, obj: addedA}),
          objectThat<IdObject>().haveProperties({id: idB, obj: addedB}),
          objectThat<IdObject>().haveProperties({id: idC, obj: addedC}),
        ]),
      }));
    });
  });
});
