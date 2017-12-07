import { assert, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { ImmutableList, ImmutableSet } from '../immutable';
import { GapiStorage } from '../store';

class TestGapiStorage extends GapiStorage<{}, {}, {}, {}, {}, {}> {
  protected hasImpl_(_fn: any, _id: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  protected listIdsImpl_(_fn: any): Promise<ImmutableSet<string>> {
    throw new Error('Method not implemented.');
  }

  protected listImpl_(_fn: any): Promise<ImmutableSet<{}>> {
    throw new Error('Method not implemented.');
  }

  protected readImpl_(_fn: any, _id: string): Promise<{} | null> {
    throw new Error('Method not implemented.');
  }
}

describe('store.GapiStorage', () => {
  let mockLibrary: any;
  let storage: TestGapiStorage;

  beforeEach(() => {
    mockLibrary = jasmine.createSpyObj('Library', ['get', 'queueRequest']);
    storage = new TestGapiStorage(mockLibrary);
  });

  describe('has', () => {
    it(`should resolve correctly`, async () => {
      const id = 'id';
      const result = true;

      const hasImplSpy = spyOn(storage, 'hasImpl_').and.returnValue(Promise.resolve(result));
      spyOn(storage, 'queueRequest_');

      assert(await storage.has(id)).to.be(result);
      assert(storage['hasImpl_']).to.haveBeenCalledWith(Matchers.any(Function), id);

      const fn = Mocks.object('fn');
      hasImplSpy.calls.argsFor(0)[0](fn);
      assert(storage['queueRequest_']).to.haveBeenCalledWith(fn);
    });
  });

  describe('list', () => {
    it(`should resolve correctly`, async () => {
      const result = ImmutableList.of([{}]);

      const listImplSpy = spyOn(storage, 'listImpl_').and.returnValue(Promise.resolve(result));
      spyOn(storage, 'queueRequest_');

      assert(await storage.list()).to.equal(result);
      assert(storage['listImpl_']).to.haveBeenCalledWith(Matchers.any(Function));

      const fn = Mocks.object('fn');
      listImplSpy.calls.argsFor(0)[0](fn);
      assert(storage['queueRequest_']).to.haveBeenCalledWith(fn);
    });
  });

  describe('listIds', () => {
    it(`should resolve correctly`, async () => {
      const result = ImmutableList.of(['id']);

      const listIdsImplSpy = spyOn(storage, 'listIdsImpl_').and
          .returnValue(Promise.resolve(result));
      spyOn(storage, 'queueRequest_');

      assert(await storage.listIds()).to.equal(result);
      assert(storage['listIdsImpl_']).to.haveBeenCalledWith(Matchers.any(Function));

      const fn = Mocks.object('fn');
      listIdsImplSpy.calls.argsFor(0)[0](fn);
      assert(storage['queueRequest_']).to.haveBeenCalledWith(fn);
    });
  });

  describe('queueRequest_', () => {
    it(`should queue the request correctly`, async () => {
      const result = Mocks.object('result');
      mockLibrary.queueRequest.and.returnValue(Promise.resolve(result));
      const mockFn = jasmine.createSpy('Fn');
      const lib = Mocks.object('lib');
      mockLibrary.get.and.returnValue(Promise.resolve(lib));

      assert(await storage['queueRequest_'](mockFn)).to.equal(result);
      assert(mockFn).to.haveBeenCalledWith(lib);
    });
  });

  describe('read', () => {
    it(`should resolve correctly`, async () => {
      const result = Mocks.object('result');
      const id = 'id';

      const readImplSpy = spyOn(storage, 'readImpl_').and.returnValue(Promise.resolve(result));
      spyOn(storage, 'queueRequest_');

      assert(await storage.read(id)).to.equal(result);
      assert(storage['readImpl_']).to.haveBeenCalledWith(Matchers.any(Function), id);

      const fn = Mocks.object('fn');
      readImplSpy.calls.argsFor(0)[0](fn);
      assert(storage['queueRequest_']).to.haveBeenCalledWith(fn);
    });
  });
});
