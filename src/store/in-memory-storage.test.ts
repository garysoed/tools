import { assert, setThat, should, test } from 'gs-testing';

import { SequentialIdGenerator } from '../random/sequential-id-generator';

import { InMemoryStorage } from './in-memory-storage';


test('@tools/store/in-memory-storage', init => {
  const _ = init(() => {
    const storage = new InMemoryStorage<number>(new SequentialIdGenerator());
    return {storage};
  });

  test('add', () => {
    should(`add the new item with the generated new ID`, () => {
      const value = 123;
      const id = _.storage.add(value);
      assert(_.storage.read(id)).to.emitWith(value);
    });
  });

  test('clear', () => {
    should(`delete all the items`, () => {
      _.storage.add(1);
      _.storage.add(2);
      _.storage.add(3);
      _.storage.clear();

      assert(_.storage.idList$).to.emitWith(setThat<string>().beEmpty());
    });
  });

  test('delete', () => {
    should(`delete the specified item`, () => {
      const id = _.storage.add(1);

      assert(_.storage.delete(id)).to.beTrue();
      assert(_.storage.idList$).to.emitWith(setThat<string>().beEmpty());
    });

    should(`return false if the specified item doesn't exist`, () => {
      assert(_.storage.delete('non existent')).to.beFalse();
    });
  });

  test('has', () => {
    should(`emit true if the object with the ID exists`, () => {
      const id = _.storage.add(1);

      assert(_.storage.has(id)).to.emitWith(true);
    });

    should(`emit false if the object with the ID doesn't exist`, () => {
      assert(_.storage.has('non existent')).to.emitWith(false);
    });
  });

  test('idList$', () => {
    should(`emit all the IDs in the storage`, () => {
      const id1 = _.storage.add(1);
      const id2 = _.storage.add(2);
      const id3 = _.storage.add(3);

      assert(_.storage.idList$).to
          .emitWith(setThat<string>().haveExactElements(new Set([id1, id2, id3])));
    });
  });

  test('read', () => {
    should(`return the object corresponding to the item`, () => {
      const value = 123;
      const id = _.storage.add(value);

      assert(_.storage.read(id)).to.emitWith(value);
    });

    should(`return undefined if the object doesn't exist`, () => {
      assert(_.storage.read('non existent')).to.emitWith(undefined);
    });
  });

  test('update', () => {
    should(`update the object corresponding to the ID`, () => {
      const value = 123;
      const id = _.storage.add(value);

      const value2 = 345;

      assert(_.storage.update(id, value2)).to.beTrue();
      assert(_.storage.read(id)).to.emitWith(value2);
    });

    should(`return false if the object for the ID doesn't exist`, () => {
      assert(_.storage.update('non existent', 123)).to.beFalse();
    });
  });
});
