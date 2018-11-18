import { assert, should } from 'gs-testing/export/main';
import { mocks } from 'gs-testing/export/mock';
import { ImmutableSet } from '../immutable/immutable-set';
import { IntegerParser } from '../parse/integer-parser';
import { WebStorage } from '../store/web-storage';
import { fake, spy } from 'gs-testing/export/spy';


describe('store.WebStorage', () => {
  const PREFIX = 'prefix';
  let storage: WebStorage<number>;

  beforeEach(() => {
    localStorage.clear();
    storage = new WebStorage(localStorage, PREFIX, IntegerParser);
  });

  describe('delete', () => {
    should('remove the correct object', async () => {
      const id = 'id';
      const path = `${PREFIX}/${id}`;
      localStorage.setItem(PREFIX, JSON.stringify([id]));
      localStorage.setItem(path, '123');

      await storage.delete(id);

      assert(localStorage.getItem(path)).to.beNull();
      assert(localStorage.getItem(PREFIX)).to.equal(JSON.stringify([]));
    });

    should('reject if the ID does not exist', async () => {
      await assert(storage.delete('id')).to.rejectWithErrorMessage(/does not exist/);
    });
  });

  describe('getIndexes_', () => {
    should('initialize the indexes first', () => {
      const indexes = storage['getIndexes_']();

      assert(indexes).to.haveElements([]);
      assert(localStorage.getItem(PREFIX)).to.equal(JSON.stringify([]));
    });

    should('not reinitialize the indexes if exists', () => {
      const index = 'index';
      const indexes = [index];
      localStorage.setItem(PREFIX, JSON.stringify(indexes));

      const indexSet = storage['getIndexes_']();

      assert(indexSet).to.haveElements(indexes);
      assert(localStorage.getItem(PREFIX)).to.equal(JSON.stringify(indexes));
    });
  });

  describe('getPath_', () => {
    should('return the correct path', () => {
      const key = 'key';
      assert(storage['getPath_'](key)).to.equal(`${PREFIX}/${key}`);
    });
  });

  describe('has', () => {
    should('resolve with true if the object is in the storage', async () => {
      const id = 'id';
      localStorage.setItem(PREFIX, JSON.stringify([id]));

      assert(await storage.has(id)).to.beTrue();
    });

    should('resolve with false if the object is in the storage', async () => {
      const id = 'id';

      assert(await storage.has(id)).to.beFalse();
    });
  });

  describe('list', () => {
    should('return the correct indexes', async () => {
      const id1 = 'id1';
      const id2 = 'id2';
      const item1 = mocks.object('item1');
      const item2 = mocks.object('item2');
      const listIdsSpy = spy(storage, 'listIds');
      fake(listIdsSpy).always().return(Promise.resolve(ImmutableSet.of([id1, id2])));
      fake(spy(storage, 'read'))
          .when(id1).return(Promise.resolve(item1))
          .when(id2).resolve(item2);

      const values = await storage.list();
      assert(values).to.haveElements([item1, item2]);
      assert(storage.read).to.haveBeenCalledWith(id1);
      assert(storage.read).to.haveBeenCalledWith(id2);
    });

    should('filter out null items', async () => {
      const id = 'id';
      spyOn(storage, 'listIds').and.returnValue(Promise.resolve(ImmutableSet.of([id])));
      spyOn(storage, 'read').and.returnValue(Promise.resolve(null));
      const values = await storage.list();
      assert(values).to.haveElements([]);
    });
  });

  describe('listIds', () => {
    should('return the indexes', async () => {
      const id1 = 'id1';
      const id2 = 'id2';
      const id3 = 'id3';
      localStorage.setItem(PREFIX, JSON.stringify([id1, id2, id3]));
      const ids = await storage.listIds();
      assert(ids).to.equal([id1, id2, id3]);
    });
  });

  describe('read', () => {
    should('resolve with the object', async () => {
      const id = 'id';
      const path = `${PREFIX}/${id}`;
      const stringValue = 'stringValue';
      const object = mocks.object('object');

      localStorage.setItem(path, '123');

      assert(await storage.read(id)).to.equal(123);
    });

    should('resolve with null if the object does not exist', async () => {
      assert(await storage.read('id')).to.beNull();
    });
  });

  describe('update', () => {
    should('store the correct object in the storage', async () => {
      const id = 'id';
      const path = `${PREFIX}/${id}`;
      const stringValue = 'stringValue';
      const oldId = 'oldId';
      const indexes = ImmutableSet.of([oldId]);

      localStorage.setItem(PREFIX, JSON.stringify([oldId]));

      await storage.update(id, 123);
      assert(localStorage.getItem(PREFIX)).to.be(JSON.stringify([oldId, id]));
      assert(localStorage.getItem(path)).to.be('123');
    });
  });

  describe('updateIndexes_', () => {
    should('update the storage correctly', () => {
      const indexes = ['index'];
      storage['updateIndexes_'](ImmutableSet.of(indexes));
      assert(localStorage.getItem(PREFIX)).to.be(JSON.stringify(indexes));
    });
  });
});
