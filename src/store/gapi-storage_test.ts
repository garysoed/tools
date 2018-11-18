import { TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { assert, Match } from 'gs-testing/export/main';
import { mocks } from 'gs-testing/export/mock';
import { ImmutableList, ImmutableSet } from '../immutable';
import { GapiStorage } from './gapi-storage';

class TestGapiStorage extends GapiStorage<{}, {}, {}, {}, {}, {}> {
  hasImpl_(_fn: any, _id: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  listIdsImpl_(_fn: any): Promise<ImmutableSet<string>> {
    throw new Error('Method not implemented.');
  }

  listImpl_(_fn: any): Promise<ImmutableSet<{}>> {
    throw new Error('Method not implemented.');
  }

  readImpl_(_fn: any, _id: string): Promise<{} | null> {
    throw new Error('Method not implemented.');
  }
}

describe('store.GapiStorage', () => {
  let mockLibrary: any;
  let storage: TestGapiStorage;

  beforeEach(() => {
    mockLibrary = createSpyObject('Library', ['get', 'queueRequest']);
    storage = new TestGapiStorage(mockLibrary);
  });

  describe('has', () => {
    should(`resolve correctly`, async () => {
      const id = 'id';
      const result = true;

      const hasImplSpy = spyOn(storage, 'hasImpl_').and.returnValue(Promise.resolve(result));
      spyOn(storage, 'queueRequest_');

      assert(await storage.has(id)).to.be(result);
      assert(storage['hasImpl_']).to.haveBeenCalledWith(Match.any(Function), id);

      const fn = mocks.object('fn');
      hasImplSpy.calls.argsFor(0)[0](fn);
      assert(storage['queueRequest_']).to.haveBeenCalledWith(fn);
    });
  });

  describe('list', () => {
    should(`resolve correctly`, async () => {
      const result = ImmutableList.of([{}]);

      const listImplSpy = spyOn(storage, 'listImpl_').and.returnValue(Promise.resolve(result));
      spyOn(storage, 'queueRequest_');

      assert(await storage.list()).to.equal(result);
      assert(storage['listImpl_']).to.haveBeenCalledWith(Match.any(Function));

      const fn = mocks.object('fn');
      listImplSpy.calls.argsFor(0)[0](fn);
      assert(storage['queueRequest_']).to.haveBeenCalledWith(fn);
    });
  });

  describe('listIds', () => {
    should(`resolve correctly`, async () => {
      const result = ImmutableList.of(['id']);

      const listIdsImplSpy = spyOn(storage, 'listIdsImpl_').and
          .returnValue(Promise.resolve(result));
      spyOn(storage, 'queueRequest_');

      assert(await storage.listIds()).to.equal(result);
      assert(storage['listIdsImpl_']).to.haveBeenCalledWith(Match.any(Function));

      const fn = mocks.object('fn');
      listIdsImplSpy.calls.argsFor(0)[0](fn);
      assert(storage['queueRequest_']).to.haveBeenCalledWith(fn);
    });
  });

  describe('queueRequest_', () => {
    should(`queue the request correctly`, async () => {
      const result = mocks.object('result');
      mockLibrary.queueRequest.and.returnValue(Promise.resolve(result));
      const mockFn = createSpy('Fn');
      const lib = mocks.object('lib');
      mockLibrary.get.and.returnValue(Promise.resolve(lib));

      assert(await storage['queueRequest_'](mockFn)).to.equal(result);
      assert(mockFn).to.haveBeenCalledWith(lib);
    });
  });

  describe('read', () => {
    should(`resolve correctly`, async () => {
      const result = mocks.object('result');
      const id = 'id';

      const readImplSpy = spyOn(storage, 'readImpl_').and.returnValue(Promise.resolve(result));
      spyOn(storage, 'queueRequest_');

      assert(await storage.read(id)).to.equal(result);
      assert(storage['readImpl_']).to.haveBeenCalledWith(Match.any(Function), id);

      const fn = mocks.object('fn');
      readImplSpy.calls.argsFor(0)[0](fn);
      assert(storage['queueRequest_']).to.haveBeenCalledWith(fn);
    });
  });
});
