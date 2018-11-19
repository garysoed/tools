import { assert, Matchers, Mocks, TestBase } from 'gs-testing/export/main';


import { DataAccess } from '../datamodel/data-access';
import { Manager } from '../datamodel/manager';
import { Searcher } from '../datamodel/searcher';
import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { EditableStorage as GsStorage } from '../store/interfaces';
import { TestDispose } from '../testing/test-dispose';

class TestManager extends Manager<any> {
  constructor(storage: GsStorage<any>, searcher: Searcher<any>) {
    super(storage, searcher, mocks.object('logger'));
  }
}

describe('datamodel.Manager', () => {
  let mockSearcher: any;
  let mockStorage: any;
  let manager: TestManager;

  beforeEach(() => {
    mockSearcher = createSpyObject('Searcher', ['index', 'search']);
    mockStorage = createSpyObject('Storage', ['generateId', 'read', 'list', 'update']);
    manager = new TestManager(mockStorage, mockSearcher);
    TestDispose.add(manager);
  });

  describe('get_', () => {
    should('return the value returned by the storage', async () => {
      const id = 'id';
      const value = mocks.object('value');
      mockStorage.read.and.returnValue(Promise.resolve(value));

      assert(await manager['get_'](id)).to.equal(value);
      assert(mockStorage.read).to.haveBeenCalledWith(id);
    });
  });

  describe('idMonad', () => {
    should(`return monad with the correct get method`, async () => {
      const itemId = 'itemId';

      mockStorage.generateId.and.returnValue(Promise.resolve(itemId));
      const monad = manager.idMonad();
      assert(await monad.get()).to.equal(itemId);

      mockStorage.generateId.calls.reset();
      assert(await monad.get()).to.equal(itemId);
      assert(mockStorage.generateId).toNot.haveBeenCalled();
    });
  });

  describe('list_', () => {
    should('return the correct projects', async () => {
      const value1 = mocks.object('value1');
      const value2 = mocks.object('value2');

      mockStorage.list.and.returnValue(Promise.resolve(ImmutableSet.of([value1, value2])));

      assert(await manager['list_']()).to.haveElements([value1, value2]);
    });
  });

  describe('monad', () => {
    should(`return monad with the correct get method`, () => {
      assert(manager.monad().get()).to.equal(Matchers.any(DataAccess));
    });

    should(`return monad with the correct set method`, async () => {
      const item1 = mocks.object('item1');
      const id1 = 'id1';

      const item2 = mocks.object('item2');
      const id2 = 'id2';

      const mockDataAccess = createSpyObject('DataAccess', ['getUpdateQueue']);
      mockDataAccess.getUpdateQueue.and.returnValue(ImmutableMap.of([[id1, item1], [id2, item2]]));

      spyOn(manager, 'update_');

      await manager.monad().set(mockDataAccess);
      assert(manager['update_']).to.haveBeenCalledWith(id1, item1);
      assert(manager['update_']).to.haveBeenCalledWith(id2, item2);
    });
  });

  describe('search_', () => {
    should('return the correct items', async () => {
      const item1 = mocks.object('item1');
      const item2 = mocks.object('item2');
      mockSearcher.search.and.returnValue(Promise.resolve(ImmutableList.of([item1, item2])));

      const token = 'token';
      assert(await manager['search_'](token)).to.haveElements([item1, item2]);
      assert(mockSearcher.search).to.haveBeenCalledWith(token);
    });
  });

  describe('update_', () => {
    should(`update the item and dispatch the 'add' event if new`, async () => {
      const id = 'id';
      const item = mocks.object('item');
      const itemList = mocks.object('itemList');
      spyOn(manager, 'list_').and.returnValue(itemList);

      mockStorage.read.and.returnValue(null);
      spyOn(manager, 'dispatch');

      await manager['update_'](id, item);
      assert(mockSearcher.index).to.haveBeenCalledWith(itemList);
      assert(manager.dispatch).to.haveBeenCalledWith({data: item, type: 'add'});
      assert(mockStorage.update).to.haveBeenCalledWith(id, item);
      assert(mockStorage.read).to.haveBeenCalledWith(id);
    });

    should(`update the item and dispatch the 'edit' event if not new`, async () => {
      const id = 'id';
      const item = mocks.object('item');
      const itemList = mocks.object('itemList');
      spyOn(manager, 'list_').and.returnValue(itemList);

      mockStorage.read.and.returnValue(mocks.object('OldItem'));
      spyOn(manager, 'dispatch');

      await manager['update_'](id, item);
      assert(mockSearcher.index).to.haveBeenCalledWith(itemList);
      assert(manager.dispatch).to.haveBeenCalledWith({data: item, type: 'edit'});
      assert(mockStorage.update).to.haveBeenCalledWith(id, item);
      assert(mockStorage.read).to.haveBeenCalledWith(id);
    });
  });
});
