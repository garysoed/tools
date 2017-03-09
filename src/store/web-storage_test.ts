import {assert, Matchers, TestBase} from '../test-base';
TestBase.setup();

import {Arrays} from '../collection/arrays';
import {Serializer} from '../data/a-serializable';
import {Mocks} from '../mock/mocks';

import {WebStorage} from './web-storage';


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

      let indexes = storage['getIndexes_']();

      assert(Arrays.fromIterable(indexes).asArray()).to.equal([]);
      assert(storage['updateIndexes_']).to.haveBeenCalledWith(Matchers.any(Set));
      assert(storage['updateIndexes_']['calls'].argsFor(0)[0].size).to.equal(0);
      assert(mockStorage.getItem).to.haveBeenCalledWith(PREFIX);
    });

    it('should not reinitialize the indexes if exists', () => {
      let index = 'index';
      let indexes = [index];
      mockStorage.getItem.and.returnValue(JSON.stringify(indexes));

      spyOn(storage, 'updateIndexes_');

      let indexSet = storage['getIndexes_']();

      assert(Arrays.fromIterable(indexSet).asArray()).to.equal(indexes);
      assert(storage['updateIndexes_']).toNot.haveBeenCalled();
    });
  });

  describe('getPath_', () => {
    it('should return the correct path', () => {
      let key = 'key';
      assert(storage['getPath_'](key)).to.equal(`${PREFIX}/${key}`);
    });
  });

  describe('updateIndexes_', () => {
    it('should update the storage correctly', () => {
      let indexes = ['index'];
      storage['updateIndexes_'](new Set(indexes));
      assert(mockStorage.setItem).to.haveBeenCalledWith(PREFIX, JSON.stringify(indexes));
    });
  });

  describe('delete', () => {
    it('should remove the correct object', async (done: any) => {
      let id = 'id';
      let path = 'path';
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
      let id = 'id';
      let path = 'path';
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
      let id = 'id';
      spyOn(storage, 'getIndexes_').and.returnValue(new Set([id]));

      let result = await storage.has(id);
      assert(result).to.beTrue();
    });

    it('should resolve with false if the object is in the storage', async (done: any) => {
      let id = 'id';

      spyOn(storage, 'getIndexes_').and.returnValue(new Set());

      let result = await storage.has(id);
      assert(result).to.beFalse();
    });
  });

  describe('list', () => {
    it('should return the correct indexes', async (done: any) => {
      let id1 = 'id1';
      let id2 = 'id2';
      let item1 = Mocks.object('item1');
      let item2 = Mocks.object('item2');
      spyOn(storage, 'listIds').and.returnValue(Promise.resolve([id1, id2]));
      spyOn(storage, 'read').and.callFake((id: string) => {
        switch (id) {
          case id1:
            return Promise.resolve(item1);
          case id2:
            return Promise.resolve(item2);
        }
      });

      let values = await storage.list();
      assert(values).to.equal([item1, item2]);
      assert(storage.read).to.haveBeenCalledWith(id1);
      assert(storage.read).to.haveBeenCalledWith(id2);
    });

    it('should filter out null items', async (done: any) => {
      let id = 'id';
      spyOn(storage, 'listIds').and.returnValue(Promise.resolve([id]));
      spyOn(storage, 'read').and.returnValue(Promise.resolve(null)); ;
      let values = await storage.list();
      assert(values).to.equal([]);
    });
  });

  describe('listIds', () => {
    it('should return the indexes', async (done: any) => {
      let indexes = Mocks.object('indexes');
      spyOn(storage, 'getIndexes_').and.returnValue(indexes);
      let ids = await storage.listIds();
      assert(ids).to.equal(indexes);
    });
  });

  describe('read', () => {
    it('should resolve with the object', async (done: any) => {
      let id = 'id';
      let path = 'path';
      let stringValue = 'stringValue';
      let object = Mocks.object('object');
      let json = Mocks.object('json');

      mockStorage.getItem.and.returnValue(stringValue);
      spyOn(storage, 'getPath_').and.returnValue(path);
      spyOn(JSON, 'parse').and.returnValue(json);
      spyOn(Serializer, 'fromJSON').and.returnValue(object);

      let result = await storage.read(id);
      assert(result).to.equal(object);
      assert(Serializer.fromJSON).to.haveBeenCalledWith(json);
      assert(JSON.parse).to.haveBeenCalledWith(stringValue);
      assert(mockStorage.getItem).to.haveBeenCalledWith(path);
      assert(storage['getPath_']).to.haveBeenCalledWith(id);
    });

    it('should resolve with null if the object does not exist', async (done: any) => {
      mockStorage.getItem.and.returnValue(null);
      spyOn(storage, 'getPath_').and.returnValue('path');

      let result = await storage.read('id');
      assert(result).to.beNull();
    });

    it('should reject if there was an error', async (done: any) => {
      let errorMsg = 'errorMsg';
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
      let initialId = 'initialId';
      let id1 = 'id1';
      let id2 = 'id2';
      let id3 = 'id3';
      spyOn(storage['idGenerator_'], 'generate').and.returnValue(id3);
      spyOn(storage, 'getIndexes_').and.returnValue(new Set([initialId, id1, id2]));

      let id = await storage.generateId();
      assert(id).to.equal(id3);
      assert(storage['idGenerator_'].generate).to.haveBeenCalledWith([initialId, id1, id2]);
    });
  });

  describe('update', () => {
    it('should store the correct object in the storage', async (done: any) => {
      let id = 'id';
      let path = 'path';
      let object = Mocks.object('object');
      let stringValue = 'stringValue';
      let json = Mocks.object('json');
      let oldId = 'oldId';
      let indexes = new Set([oldId]);

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
      let errorMsg = 'errorMsg';

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
