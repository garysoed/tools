import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Arrays } from '../collection/arrays';
import { Serializer } from '../data/a-serializable';
import { Fakes } from '../mock/fakes';
import { Mocks } from '../mock/mocks';

import { WebStorage } from './web-storage';


describe('store.WebStorage', () => {
  const PREFIX = 'prefix';
  let mockStorage;
  let storage: WebStorage<any>;

  beforeEach(() => {
    mockStorage = jasmine.createSpyObj('Storage', ['getItem', 'removeItem', 'setItem']);
    storage = new WebStorage<any>(mockStorage, PREFIX);
  });

  describe('getIndexes_', () => {
    it('should initialize the indexes first', () => {
      mockStorage.getItem.and.returnValues(null);

      spyOn(storage, 'updateIndexes_');

      const indexes = storage['getIndexes_']();

      assert(Arrays.fromIterable(indexes).asArray()).to.equal([]);
      assert(storage['updateIndexes_']).to.haveBeenCalledWith(Matchers.any(Set));
      assert(storage['updateIndexes_']['calls'].argsFor(0)[0].size).to.equal(0);
      assert(mockStorage.getItem).to.haveBeenCalledWith(PREFIX);
    });

    it('should not reinitialize the indexes if exists', () => {
      const index = 'index';
      const indexes = [index];
      mockStorage.getItem.and.returnValue(JSON.stringify(indexes));

      spyOn(storage, 'updateIndexes_');

      const indexSet = storage['getIndexes_']();

      assert(Arrays.fromIterable(indexSet).asArray()).to.equal(indexes);
      assert(storage['updateIndexes_']).toNot.haveBeenCalled();
    });
  });

  describe('getPath_', () => {
    it('should return the correct path', () => {
      const key = 'key';
      assert(storage['getPath_'](key)).to.equal(`${PREFIX}/${key}`);
    });
  });

  describe('updateIndexes_', () => {
    it('should update the storage correctly', () => {
      const indexes = ['index'];
      storage['updateIndexes_'](new Set(indexes));
      assert(mockStorage.setItem).to.haveBeenCalledWith(PREFIX, JSON.stringify(indexes));
    });
  });

  describe('delete', () => {
    it('should remove the correct object', async (done: any) => {
      const id = 'id';
      const path = 'path';
      spyOn(storage, 'getPath_').and.returnValue(path);
      spyOn(storage, 'getIndexes_').and.returnValue(new Set([id]));
      spyOn(storage, 'updateIndexes_');

      await storage.delete(id);

      assert(mockStorage.removeItem).to.haveBeenCalledWith(path);
      assert(storage['getPath_']).to.haveBeenCalledWith(id);
      assert(storage['updateIndexes_']).to.haveBeenCalledWith(Matchers.any(Set));
      assert(storage['updateIndexes_']['calls'].argsFor(0)[0].size).to.equal(0);
    });

    it('should reject if the ID does not exist', async (done: any) => {
      const id = 'id';
      const path = 'path';
      spyOn(storage, 'getPath_').and.returnValue(path);
      spyOn(storage, 'getIndexes_').and.returnValue(new Set());
      spyOn(storage, 'updateIndexes_');

      try {
        await storage.delete(id);
        done.fail();
      } catch (error) {
        const err: Error = error;
        assert(err.message).to.match(/does not exist/);
        assert(mockStorage.removeItem).toNot.haveBeenCalled();
        assert(storage['updateIndexes_']).toNot.haveBeenCalled();
      }
    });
  });

  describe('has', () => {
    it('should resolve with true if the object is in the storage', async (done: any) => {
      const id = 'id';
      spyOn(storage, 'getIndexes_').and.returnValue(new Set([id]));

      const result = await storage.has(id);
      assert(result).to.beTrue();
    });

    it('should resolve with false if the object is in the storage', async (done: any) => {
      const id = 'id';

      spyOn(storage, 'getIndexes_').and.returnValue(new Set());

      const result = await storage.has(id);
      assert(result).to.beFalse();
    });
  });

  describe('list', () => {
    it('should return the correct indexes', async (done: any) => {
      const id1 = 'id1';
      const id2 = 'id2';
      const item1 = Mocks.object('item1');
      const item2 = Mocks.object('item2');
      spyOn(storage, 'listIds').and.returnValue(Promise.resolve([id1, id2]));
      Fakes.build(spyOn(storage, 'read'))
          .when(id1).resolve(item1)
          .when(id2).resolve(item2);

      const values = await storage.list();
      assert(values).to.equal([item1, item2]);
      assert(storage.read).to.haveBeenCalledWith(id1);
      assert(storage.read).to.haveBeenCalledWith(id2);
    });

    it('should filter out null items', async (done: any) => {
      const id = 'id';
      spyOn(storage, 'listIds').and.returnValue(Promise.resolve([id]));
      spyOn(storage, 'read').and.returnValue(Promise.resolve(null)); ;
      const values = await storage.list();
      assert(values).to.equal([]);
    });
  });

  describe('listIds', () => {
    it('should return the indexes', async (done: any) => {
      const indexes = Mocks.object('indexes');
      spyOn(storage, 'getIndexes_').and.returnValue(indexes);
      const ids = await storage.listIds();
      assert(ids).to.equal(indexes);
    });
  });

  describe('read', () => {
    it('should resolve with the object', async (done: any) => {
      const id = 'id';
      const path = 'path';
      const stringValue = 'stringValue';
      const object = Mocks.object('object');
      const json = Mocks.object('json');

      mockStorage.getItem.and.returnValue(stringValue);
      spyOn(storage, 'getPath_').and.returnValue(path);
      spyOn(JSON, 'parse').and.returnValue(json);
      spyOn(Serializer, 'fromJSON').and.returnValue(object);

      const result = await storage.read(id);
      assert(result).to.equal(object);
      assert(Serializer.fromJSON).to.haveBeenCalledWith(json);
      assert(JSON.parse).to.haveBeenCalledWith(stringValue);
      assert(mockStorage.getItem).to.haveBeenCalledWith(path);
      assert(storage['getPath_']).to.haveBeenCalledWith(id);
    });

    it('should resolve with null if the object does not exist', async (done: any) => {
      mockStorage.getItem.and.returnValue(null);
      spyOn(storage, 'getPath_').and.returnValue('path');

      const result = await storage.read('id');
      assert(result).to.beNull();
    });

    it('should reject if there was an error', async (done: any) => {
      const errorMsg = 'errorMsg';
      mockStorage.getItem.and.throwError(errorMsg);
      spyOn(storage, 'getPath_').and.returnValue('path');

      try {
        await storage.read('id');
        done.fail();
      } catch (e) {
        const error: Error = e;
        assert(error.message).to.equal(errorMsg);
      }
    });
  });

  describe('reserve', () => {
    it('should reserve a new ID correctly', async (done: any) => {
      const initialId = 'initialId';
      const id1 = 'id1';
      const id2 = 'id2';
      const id3 = 'id3';
      spyOn(storage['idGenerator_'], 'generate').and.returnValue(id3);
      spyOn(storage, 'getIndexes_').and.returnValue(new Set([initialId, id1, id2]));

      const id = await storage.generateId();
      assert(id).to.equal(id3);
      assert(storage['idGenerator_'].generate).to.haveBeenCalledWith([initialId, id1, id2]);
    });
  });

  describe('update', () => {
    it('should store the correct object in the storage', async (done: any) => {
      const id = 'id';
      const path = 'path';
      const object = Mocks.object('object');
      const stringValue = 'stringValue';
      const json = Mocks.object('json');
      const oldId = 'oldId';
      const indexes = new Set([oldId]);

      spyOn(storage, 'getIndexes_').and.returnValue(indexes);
      spyOn(storage, 'updateIndexes_');
      spyOn(storage, 'getPath_').and.returnValue(path);
      spyOn(Serializer, 'toJSON').and.returnValue(json);
      spyOn(JSON, 'stringify').and.returnValue(stringValue);

      await storage.update(id, object);
      assert(mockStorage.setItem).to.haveBeenCalledWith(path, stringValue);
      assert(JSON.stringify).to.haveBeenCalledWith(json);
      assert(Serializer.toJSON).to.haveBeenCalledWith(object);
      assert(storage['updateIndexes_']).to.haveBeenCalledWith(Matchers.any(Set));
      assert(Arrays.fromIterable(storage['updateIndexes_']['calls'].argsFor(0)[0]).asArray())
          .to.equal([oldId, id]);
    });

    it('should reject if there was an error', async (done: any) => {
      const errorMsg = 'errorMsg';

      spyOn(Serializer, 'toJSON').and.throwError(errorMsg);
      spyOn(storage, 'getIndexes_').and.returnValue(new Set());

      try {
        await storage.update('id', Mocks.object('object'));
        done.fail();
      } catch (e) {
        const error: Error = e;
        assert(error.message).to.equal(errorMsg);
      }
    });
  });
});
