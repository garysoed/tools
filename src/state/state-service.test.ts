import { arrayThat, assert, createSpySubject, objectThat, should, test } from 'gs-testing';
import { map } from 'rxjs/operators';

import { IdObject, Snapshot } from './snapshot';
import { createId } from './state-id';
import { StateService } from './state-service';


test('@tools/state/state-service', init => {
  const _ = init(() => {
    const service = new StateService();
    const onChange$ = createSpySubject(service.onChange$);
    return {onChange$, service};
  });

  test('add', () => {
    should(`add the object and give it a unique ID`, () => {
      const value = 'value';

      const id = _.service.add<string>(value);

      assert(_.service.get(id)).to.emitWith(value);
      assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([id.id]);
    });
  });

  test('clear', () => {
    should(`delete the objects and return true if it exists`, () => {
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
      assert(_.service.get(addedId1)).to.emitWith(null);
      assert(_.service.get(addedId2)).to.emitWith(null);
    });
  });

  test('delete', _, init => {
    const _ = init(_ => {
      const addedId = _.service.add<string>('initValue');
      return {..._, addedId};
    });

    should(`delete the object and return true if it exists`, () => {
      assert(_.service.delete(_.addedId)).to.beTrue();

      assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([_.addedId.id, _.addedId.id]);
      assert(_.service.get(_.addedId)).to.emitWith(null);
    });

    should(`return false if the object does not exist`, () => {
      const otherId = createId<string>('other');
      assert(_.service.delete(otherId)).to.beFalse();

      assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([_.addedId.id]);
    });
  });

  test('get', _, init => {
    const _ = init(_ => {
      const addedValue = 'addedValue';
      const addedId = _.service.add<string>(addedValue);
      return {..._, addedId, addedValue};
    });

    should(`emit the correct object if it exists`, () => {
      assert(_.service.get(_.addedId)).to.emitWith(_.addedValue);
    });

    should(`emit null if the object does not exist`, () => {
      assert(_.service.get(createId<string>('other'))).to.emitWith(null);
    });

    should(`handle falsy object that are not null`, () => {
      _.service.set(_.addedId, '');
      assert(_.service.get(createId<string>('other'))).to.emitWith(null);
    });
  });

  test('init', () => {
    should(`initialize all the values in the service`, () => {
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
      assert(_.service.get(idA)).to.emitWith(valueA);
    });
  });

  test('set',  _, init => {
    const _ = init(_ => {
      const addedValue = 'addedValue';
      const addedId = _.service.add<string>(addedValue);
      return {..._, addedId, addedValue};
    });

    should(`update the value correctly and return true if the ID exist`, () => {
      const newValue = 'newValue';
      assert(_.service.set(_.addedId, newValue)).to.beTrue();

      assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([_.addedId.id, _.addedId.id]);
      assert(_.service.get(_.addedId)).to.emitWith(newValue);
    });

    should(`return false if the ID doesn't exist`, () => {
      const newValue = {value: 'new'};
      const otherId = createId<{value: string}>('otherId');
      assert(_.service.set(otherId, newValue)).to.beFalse();

      assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([_.addedId.id, otherId.id]);
      assert(_.service.get(_.addedId)).to.emitWith(_.addedValue);
      assert(_.service.get(otherId)).to.emitWith(newValue);
    });
  });

  test('snapshot', () => {
    should(`return all the objects`, () => {
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

    should(`return null if the object for the root ID is missing`, () => {
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
