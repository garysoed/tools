import { assert, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { DataAccess } from '../datamodel/data-access';
import { Manager } from '../datamodel/manager';
import { Searcher } from '../datamodel/searcher';
import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Storage as GsStorage } from '../store/interfaces';
import { TestDispose } from '../testing/test-dispose';

class TestManager extends Manager<any> {
  constructor(storage: GsStorage<any>, searcher: Searcher<any>) {
    super(storage, searcher, Mocks.object('logger'));
  }
}

describe('datamodel.Manager', () => {
  let mockSearcher: any;
  let mockStorage: any;
  let manager: TestManager;

  beforeEach(() => {
    mockSearcher = jasmine.createSpyObj('Searcher', ['index', 'search']);
    mockStorage = jasmine.createSpyObj('Storage', ['generateId', 'read', 'list', 'update']);
    manager = new TestManager(mockStorage, mockSearcher);
    TestDispose.add(manager);
  });

  describe('get_', () => {
    it('should return the value returned by the storage', async () => {
      const id = 'id';
      const value = Mocks.object('value');
      mockStorage.read.and.returnValue(Promise.resolve(value));

      assert(await manager['get_'](id)).to.equal(value);
      assert(mockStorage.read).to.haveBeenCalledWith(id);
    });
  });

  describe('idMonad', () => {
    it(`should return monad with the correct get method`, async () => {
      const itemId = 'itemId';

      mockStorage.generateId.and.returnValue(Promise.resolve(itemId));
      const monad = manager.idMonad()(Mocks.object('instance'));
      assert(await monad.get()).to.equal(itemId);

      mockStorage.generateId.calls.reset();
      assert(await monad.get()).to.equal(itemId);
      assert(mockStorage.generateId).toNot.haveBeenCalled();
    });
  });

  describe('list_', () => {
    it('should return the correct projects', async () => {
      const value1 = Mocks.object('value1');
      const value2 = Mocks.object('value2');

      mockStorage.list.and.returnValue(Promise.resolve(ImmutableSet.of([value1, value2])));

      assert(await manager['list_']()).to.haveElements([value1, value2]);
    });
  });

  describe('monad', () => {
    it(`should return monad with the correct get method`, () => {
      assert(manager.monad()(Mocks.object('instance')).get()).to.equal(Matchers.any(DataAccess));
    });

    it(`should return monad with the correct set method`, async () => {
      const item1 = Mocks.object('item1');
      const id1 = 'id1';

      const item2 = Mocks.object('item2');
      const id2 = 'id2';

      const mockDataAccess = jasmine.createSpyObj('DataAccess', ['getUpdateQueue']);
      mockDataAccess.getUpdateQueue.and.returnValue(ImmutableMap.of([[id1, item1], [id2, item2]]));

      spyOn(manager, 'update_');

      await manager.monad()(Mocks.object('instance')).set(mockDataAccess);
      assert(manager['update_']).to.haveBeenCalledWith(id1, item1);
      assert(manager['update_']).to.haveBeenCalledWith(id2, item2);
    });
  });

  describe('search_', () => {
    it('should return the correct items', async () => {
      const item1 = Mocks.object('item1');
      const item2 = Mocks.object('item2');
      mockSearcher.search.and.returnValue(Promise.resolve(ImmutableList.of([item1, item2])));

      const token = 'token';
      assert(await manager['search_'](token)).to.haveElements([item1, item2]);
      assert(mockSearcher.search).to.haveBeenCalledWith(token);
    });
  });

  describe('update_', () => {
    it(`should update the item and dispatch the 'add' event if new`, async () => {
      const id = 'id';
      const item = Mocks.object('item');
      const itemList = Mocks.object('itemList');
      spyOn(manager, 'list_').and.returnValue(itemList);

      mockStorage.read.and.returnValue(null);
      spyOn(manager, 'dispatch');

      await manager['update_'](id, item);
      assert(mockSearcher.index).to.haveBeenCalledWith(itemList);
      assert(manager.dispatch).to.haveBeenCalledWith({data: item, type: 'add'});
      assert(mockStorage.update).to.haveBeenCalledWith(id, item);
      assert(mockStorage.read).to.haveBeenCalledWith(id);
    });

    it(`should update the item and dispatch the 'edit' event if not new`, async () => {
      const id = 'id';
      const item = Mocks.object('item');
      const itemList = Mocks.object('itemList');
      spyOn(manager, 'list_').and.returnValue(itemList);

      mockStorage.read.and.returnValue(Mocks.object('OldItem'));
      spyOn(manager, 'dispatch');

      await manager['update_'](id, item);
      assert(mockSearcher.index).to.haveBeenCalledWith(itemList);
      assert(manager.dispatch).to.haveBeenCalledWith({data: item, type: 'edit'});
      assert(mockStorage.update).to.haveBeenCalledWith(id, item);
      assert(mockStorage.read).to.haveBeenCalledWith(id);
    });
  });
});
