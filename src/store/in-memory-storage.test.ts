import {assert, setThat, setup, should, test} from 'gs-testing';

import {InMemoryStorage} from './in-memory-storage';


test('@tools/store/in-memory-storage', () => {
  const _ = setup(() => {
    const storage = new InMemoryStorage<number>();
    return {storage};
  });

  test('clear', () => {
    should('delete all the items', () => {
      _.storage.update('id1', 1);
      _.storage.update('id2', 2);
      _.storage.update('id3', 3);
      _.storage.clear();

      assert(_.storage.idList$).to.emitWith(setThat<string>().beEmpty());
    });
  });

  test('delete', () => {
    should('delete the specified item', () => {
      const id = 'id';
      _.storage.update(id, 1);

      assert(_.storage.delete(id)).to.beTrue();
      assert(_.storage.idList$).to.emitWith(setThat<string>().beEmpty());
    });

    should('return false if the specified item doesn\'t exist', () => {
      assert(_.storage.delete('non existent')).to.beFalse();
    });
  });

  test('has', () => {
    should('emit true if the object with the ID exists', () => {
      const id = 'id';
      _.storage.update(id, 1);

      assert(_.storage.has(id)).to.emitWith(true);
    });

    should('emit false if the object with the ID doesn\'t exist', () => {
      assert(_.storage.has('non existent')).to.emitWith(false);
    });
  });

  test('idList$', () => {
    should('emit all the IDs in the storage', () => {
      const id1 = 'id1';
      const id2 = 'id2';
      const id3 = 'id3';
      _.storage.update(id1, 1);
      _.storage.update(id2, 2);
      _.storage.update(id3, 3);

      assert(_.storage.idList$).to
          .emitWith(setThat<string>().haveExactElements(new Set([id1, id2, id3])));
    });
  });

  test('read', () => {
    should('return the object corresponding to the item', () => {
      const value = 123;
      const id = 'id';
      _.storage.update(id, value);

      assert(_.storage.read(id)).to.emitWith(value);
    });

    should('return undefined if the object doesn\'t exist', () => {
      assert(_.storage.read('non existent')).to.emitWith(undefined);
    });
  });

  test('update', () => {
    should('update the object corresponding to the ID', () => {
      const value = 123;
      const id = 'id';
      _.storage.update(id, value);

      const value2 = 345;

      assert(_.storage.update(id, value2)).to.beTrue();
      assert(_.storage.read(id)).to.emitWith(value2);
    });

    should('return false if the object for the ID doesn\'t exist', () => {
      const value = 123;
      const id = 'id';

      assert(_.storage.update(id, value)).to.beFalse();
      assert(_.storage.read(id)).to.emitWith(value);
    });
  });
});
