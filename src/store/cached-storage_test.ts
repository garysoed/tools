import {assert, TestBase} from '../test-base';
TestBase.setup();

import {BaseDisposable} from '../dispose/base-disposable';
import {Mocks} from '../mock/mocks';
import {TestDispose} from '../testing/test-dispose';

import {CachedStorage} from './cached-storage';


describe('store.CachedStorage', () => {
  let mockInnerStorage;
  let storage: CachedStorage<string>;

  beforeEach(() => {
    mockInnerStorage = jasmine.createSpyObj('InnerStorage', [
      'delete',
      'generateId',
      'has',
      'listIds',
      'read',
      'update',
    ]);
    storage = new CachedStorage<string>(mockInnerStorage);
    TestDispose.add(storage);
  });

  describe('delete', () => {
    it('should delete the item in the cache and in the inner storage', async (done: any) => {
      let mockItem = jasmine.createSpyObj('Item', ['dispose']);
      Object.setPrototypeOf(mockItem, BaseDisposable.prototype);

      let id = 'id';
      storage['cache_'].set(id, mockItem);

      mockInnerStorage.delete.and.returnValue(Promise.resolve());

      await storage.delete(id);
      assert(mockInnerStorage.delete).to.haveBeenCalledWith(id);
      assert(storage['cache_']).to.haveEntries([]);
      assert(mockItem.dispose).to.haveBeenCalledWith();
    });

    it('should not throw error if the deleted item is not disposable', async (done: any) => {
      let item = Mocks.object('item');
      let id = 'id';
      storage['cache_'].set(id, item);

      mockInnerStorage.delete.and.returnValue(Promise.resolve());

      await storage.delete(id);
      assert(mockInnerStorage.delete).to.haveBeenCalledWith(id);
      assert(storage['cache_']).to.haveEntries([]);
    });

    it('should not throw error if the item does not exist', async (done: any) => {
      let id = 'id';
      mockInnerStorage.delete.and.returnValue(Promise.resolve());

      await storage.delete('id');
      assert(mockInnerStorage.delete).to.haveBeenCalledWith(id);
      assert(storage['cache_']).to.haveEntries([]);
    });
  });

  describe('disposeInternal', () => {
    it('should dispose all entries in the cache if they are disposable', () => {
      let mockDisposableItem1 = jasmine.createSpyObj('DisposableItem1', ['dispose']);
      let mockDisposableItem2 = jasmine.createSpyObj('DisposableItem2', ['dispose']);
      Object.setPrototypeOf(mockDisposableItem1, BaseDisposable.prototype);
      Object.setPrototypeOf(mockDisposableItem2, BaseDisposable.prototype);

      let nonDisposableItem = Mocks.object('nonDisposableItem');
      let id1 = 'id1';
      let id2 = 'id2';
      let nonDisposableId = 'nonDisposableId';

      storage['cache_'].set(id1, mockDisposableItem1);
      storage['cache_'].set(id2, mockDisposableItem2);
      storage['cache_'].set(nonDisposableId, nonDisposableItem);

      storage.disposeInternal();

      assert(mockDisposableItem1.dispose).to.haveBeenCalledWith();
      assert(mockDisposableItem2.dispose).to.haveBeenCalledWith();
    });
  });

  describe('generateId', () => {
    it('should return the correct ID from the inner storage', async (done: any) => {
      let newId = 'newId';
      mockInnerStorage.generateId.and.returnValue(Promise.resolve(newId));
      let id = await storage.generateId();
      assert(id).to.equal(newId);
    });
  });

  describe('has', () => {
    it('should return the values from the inner storage and cache them', async (done: any) => {
      let id = 'id';
      mockInnerStorage.has.and.returnValue(Promise.resolve(true));
      let actualResult = await storage.has(id);
      assert(actualResult).to.beTrue();
      assert(mockInnerStorage.has).to.haveBeenCalledWith(id);
    });
  });

  describe('list', () => {
    it('should return all the items and cache them', async (done: any) => {
      let id1 = 'id1';
      let id2 = 'id2';
      let id3 = 'id3';
      mockInnerStorage.listIds.and.returnValue(Promise.resolve([id1, id2, id3]));

      let item1 = Mocks.object('item1');
      let item2 = Mocks.object('item2');
      let item3 = Mocks.object('item3');
      mockInnerStorage.read.and.callFake((id: string) => {
        switch (id) {
          case id1:
            return Promise.resolve(item1);
          case id2:
            return Promise.resolve(item2);
          case id3:
            return Promise.resolve(item3);
        }
      });

      let items = await storage.list();
      assert(items).to.equal([item1, item2, item3]);
      assert(storage['cache_']).to.haveEntries([
        [id1, item1],
        [id2, item2],
        [id3, item3],
      ]);
    });
  });

  describe('listIds', () => {
    it('should return the correct list of IDs', async (done: any) => {
      let ids = Mocks.object('ids');
      mockInnerStorage.listIds.and.returnValue(Promise.resolve(ids));

      let actualIds = await storage.listIds();
      assert(actualIds).to.equal(ids);
    });
  });

  describe('read', () => {
    it('should get the item from the inner storage and cache them', async (done: any) => {
      let id = 'id';
      let item = Mocks.object('item');
      mockInnerStorage.read.and.returnValue(Promise.resolve(item));
      let actualItem = await storage.read(id);
      assert(actualItem).to.equal(item);
      assert(storage['cache_']).to.haveEntries([[id, item]]);
      assert(mockInnerStorage.read).to.haveBeenCalledWith(id);
    });

    it('should not cache the value if null', async (done: any) => {
      mockInnerStorage.read.and.returnValue(Promise.resolve(null));
      let actualItem = await storage.read('id');
      assert(actualItem).to.beNull();
      assert(storage['cache_']).to.haveEntries([]);
    });

    it('should return the cached value if available', async (done: any) => {
      let id = 'id';
      let item = Mocks.object('item');
      storage['cache_'].set(id, item);
      let actualItem = await storage.read(id);
      assert(actualItem).to.equal(item);
      assert(mockInnerStorage.read).toNot.haveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update the inner storage and the cache with the new value', async (done: any) => {
      let id = 'id';
      let oldItem = Mocks.object('oldItem');
      storage['cache_'].set(id, oldItem);

      let newItem = Mocks.object('newItem');
      mockInnerStorage.update.and.returnValue(Promise.resolve());
      await storage.update(id, newItem);
      assert(storage['cache_']).to.haveEntries([[id, newItem]]);
      assert(mockInnerStorage.update).to.haveBeenCalledWith(id, newItem);
    });
  });
});
