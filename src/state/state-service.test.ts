import {assert, createSpySubject, should, test} from 'gs-testing';
import {map} from 'rxjs/operators';

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

    should('make all the changes in one transaction', () => {
      const value = 'value';

      const id = _.service.modify(x => x.add(value));

      const value$ = createSpySubject(_.service.resolve(id));

      _.service.modify(x => {
        x.set(id, 'newValue');
        x.delete(id);
      });

      assert(value$).to.emitSequence([value, undefined]);
      assert(_.onChange$.pipe(map(({id}) => id))).to.emitSequence([id.id, id.id]);
    });
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
});
