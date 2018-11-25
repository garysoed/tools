import { assert, should, test } from 'gs-testing/export/main';
import { mocks } from 'gs-testing/export/mock';
import { createSpyInstance, createSpyObject, fake, resetCalls, SpyObj } from 'gs-testing/export/spy';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { BaseDisposable } from '../dispose/base-disposable';
import { TestDispose } from '../dispose/testing/test-dispose';
import { ImmutableSet } from '../immutable/immutable-set';
import { CachedStorage } from '../store/cached-storage';
import { EditableStorage } from './editable-storage';


test.skip('store.CachedStorage', () => {
  let mockInnerStorage: SpyObj<EditableStorage<{}>>;
  let storage: CachedStorage<{}>;

  beforeEach(() => {
    mockInnerStorage = createSpyObject('InnerStorage', [
      'delete',
      'generateId',
      'has',
      'listIds',
      'read',
      'update',
    ]);
    storage = new CachedStorage(mockInnerStorage);
    TestDispose.add(storage);
  });

  test('delete', () => {
    should('delete the item in the cache and in the inner storage', () => {
      const mockItem = createSpyInstance(BaseDisposable);
      const id = 'id';
      storage.update(id, mockItem);

      const idsSubject = new BehaviorSubject<ImmutableSet<string>|null>(null);
      storage.listIds().subscribe(idsSubject);

      storage.delete(id);
      assert(mockInnerStorage.delete).to.haveBeenCalledWith(id);
      assert(mockItem.dispose).to.haveBeenCalledWith();
      // tslint:disable-next-line:no-non-null-assertion
      assert(idsSubject.getValue()!).to.beEmpty();
    });

    should('not throw error if the deleted item is not disposable', () => {
      const item = mocks.object('item');
      const id = 'id';
      storage.update(id, item);

      const idsSubject = new BehaviorSubject<ImmutableSet<string>|null>(null);
      storage.listIds().subscribe(idsSubject);

      storage.delete(id);
      assert(mockInnerStorage.delete).to.haveBeenCalledWith(id);
      // tslint:disable-next-line:no-non-null-assertion
      assert(idsSubject.getValue()!).to.beEmpty();
    });

    should('not throw error if the item does not exist', () => {
      const id = 'id';

      const idsSubject = new BehaviorSubject<ImmutableSet<string>|null>(null);
      storage.listIds().subscribe(idsSubject);

      storage.delete('id');
      assert(mockInnerStorage.delete).to.haveBeenCalledWith(id);
      // tslint:disable-next-line:no-non-null-assertion
      assert(idsSubject.getValue()!).to.beEmpty();
    });
  });

  test('read', () => {
    should('get the item from the inner storage and cache them', () => {
      const id = 'id';
      const item = mocks.object('item');
      fake(mockInnerStorage.read).always().return(observableOf(item));

      const itemSubject = new BehaviorSubject<{}|null>(null);
      storage.read(id).subscribe(itemSubject);
      assert(itemSubject.getValue()).to.equal(item);
      assert(mockInnerStorage.read).to.haveBeenCalledWith(id);

      resetCalls(mockInnerStorage.read);
      const itemSubject2 = new BehaviorSubject<{}|null>(null);
      storage.read(id).subscribe(itemSubject);
      assert(itemSubject2.getValue()).to.equal(item);
      assert(mockInnerStorage.read).toNot.haveBeenCalled();
    });
  });

  test('update', () => {
    should('update the inner storage and the cache with the new value', () => {
      const id = 'id';
      const oldItem = mocks.object('oldItem');
      storage.update(id, oldItem);

      const itemSubject = new BehaviorSubject<{}|null>(null);
      storage.read(id).subscribe(itemSubject);

      const newItem = mocks.object('newItem');
      storage.update(id, newItem);

      assert(itemSubject.getValue()).to.equal(newItem);
      assert(mockInnerStorage.update).to.haveBeenCalledWith(id, newItem);
    });
  });
});
