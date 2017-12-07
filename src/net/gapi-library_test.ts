import { assert, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { GapiLibrary } from '../net';
import { GapiError } from '../net/gapi-error';
import { QUEUED_REQUESTS } from '../net/gapi-library';


describe('net.GapiLibrary', () => {
  const NAME: string = 'name';
  let mockGapi: any;
  let mockWindow: any;
  let library: GapiLibrary<number>;

  beforeEach(() => {
    mockGapi = jasmine.createSpyObj(
        'Gapi',
        ['addDiscoveryDocs', 'addScopes', 'addSignIn', 'init']);
    mockWindow = jasmine.createSpyObj('Window', ['clearTimeout', 'setTimeout']);
    library = new GapiLibrary(mockGapi, NAME, mockWindow);
    QUEUED_REQUESTS.clear();
    GapiLibrary['timeoutId_'] = null;
  });

  describe('flushRequests_', () => {
    it(`should call the callback on all the queued callbacks`, async () => {
      const mockCallback1 = jasmine.createSpy('Callback1');
      const mockCallback2 = jasmine.createSpy('Callback2');
      const request1 = Mocks.object('request1');
      const request2 = Mocks.object('request2');
      QUEUED_REQUESTS.set(request1, mockCallback1);
      QUEUED_REQUESTS.set(request2, mockCallback2);

      const result1 = Mocks.object('result1');
      const result2 = Mocks.object('result2');
      const responseMap = new Map([[request1, result1], [request2, result2]]);

      const batches = new Map();
      const mockBatchAdd = jasmine.createSpy('BatchAdd').and
          .callFake((request: any, config: {id: any}) => batches.set(request, config.id));

      const mockBatch = new Promise((resolve) => {
        const intervalId = window.setInterval(() => {
          const result = {};
          for (const [request, response] of responseMap) {
            const batchId = batches.get(request);
            if (!batchId) {
              return;
            }

            result[batchId] = {result: response, status: 200};
          }

          window.clearInterval(intervalId);
          resolve({
            result,
            status: 200,
          });
        }, 0);
      });
      mockBatch['add'] = mockBatchAdd;

      const mockClient = jasmine.createSpyObj('Client', ['newBatch']);
      mockClient.newBatch.and.returnValue(Promise.resolve(mockBatch));
      spyOn(library, 'client').and.returnValue(Promise.resolve(mockClient));

      await library['flushRequests_']();
      assert(mockCallback1).to.haveBeenCalledWith(result1);
      assert(mockCallback2).to.haveBeenCalledWith(result2);
      assert(mockBatchAdd).to.haveBeenCalledWith(request1, Matchers.any(Object));
      assert(mockBatchAdd).to.haveBeenCalledWith(request2, Matchers.any(Object));
      assert(QUEUED_REQUESTS).to.haveEntries([]);
    });

    it(`should handle errors correctly on failed requests`, async () => {
      const mockCallback1 = jasmine.createSpy('Callback1');
      const mockCallback2 = jasmine.createSpy('Callback2');
      const request1 = Mocks.object('request1');
      const request2 = Mocks.object('request2');
      QUEUED_REQUESTS.set(request1, mockCallback1);
      QUEUED_REQUESTS.set(request2, mockCallback2);

      const result1 = Mocks.object('result1');
      const result2 = Mocks.object('result2');
      const responseMap = new Map([[request1, result1], [request2, result2]]);

      const batches = new Map();
      const mockBatchAdd = jasmine.createSpy('BatchAdd').and
          .callFake((request: any, config: {id: any}) => batches.set(request, config.id));

      const mockBatch = new Promise((resolve) => {
        const intervalId = window.setInterval(() => {
          const result = {};
          for (const [request, response] of responseMap) {
            const batchId = batches.get(request);
            if (!batchId) {
              return;
            }

            result[batchId] = {result: response, status: 500};
          }

          window.clearInterval(intervalId);
          resolve({
            result,
            status: 200,
          });
        }, 0);
      });
      mockBatch['add'] = mockBatchAdd;

      const mockClient = jasmine.createSpyObj('Client', ['newBatch']);
      mockClient.newBatch.and.returnValue(Promise.resolve(mockBatch));
      spyOn(library, 'client').and.returnValue(Promise.resolve(mockClient));

      await library['flushRequests_']();
      assert(mockCallback1).to.haveBeenCalledWith(Matchers.any(GapiError));
      assert(mockCallback2).to.haveBeenCalledWith(Matchers.any(GapiError));
      assert(mockBatchAdd).to.haveBeenCalledWith(request1, Matchers.any(Object));
      assert(mockBatchAdd).to.haveBeenCalledWith(request2, Matchers.any(Object));
      assert(QUEUED_REQUESTS).to.haveEntries([]);
    });

    it(`should pass errors on all callbacks if the entire batch fails`, async () => {
      const mockCallback1 = jasmine.createSpy('Callback1');
      const mockCallback2 = jasmine.createSpy('Callback2');
      const request1 = Mocks.object('request1');
      const request2 = Mocks.object('request2');
      QUEUED_REQUESTS.set(request1, mockCallback1);
      QUEUED_REQUESTS.set(request2, mockCallback2);

      const mockBatchAdd = jasmine.createSpy('BatchAdd');

      const mockBatch = Promise.resolve({
        status: 500,
      });
      mockBatch['add'] = mockBatchAdd;

      const mockClient = jasmine.createSpyObj('Client', ['newBatch']);
      mockClient.newBatch.and.returnValue(Promise.resolve(mockBatch));
      spyOn(library, 'client').and.returnValue(Promise.resolve(mockClient));

      await library['flushRequests_']();
      assert(mockCallback1).to.haveBeenCalledWith(Matchers.any(GapiError));
      assert(mockCallback2).to.haveBeenCalledWith(Matchers.any(GapiError));
      assert(mockBatchAdd).to.haveBeenCalledWith(request1, Matchers.any(Object));
      assert(mockBatchAdd).to.haveBeenCalledWith(request2, Matchers.any(Object));
      assert(QUEUED_REQUESTS).to.haveEntries([]);
    });

    it(`should clear the previous timeout IDs`, async () => {
      const existingTimeoutId = 123;
      GapiLibrary['timeoutId_'] = existingTimeoutId;

      const mockBatchAdd = jasmine.createSpy('BatchAdd');
      const mockBatch = Promise.resolve({
        status: 500,
      });
      mockBatch['add'] = mockBatchAdd;

      const mockClient = jasmine.createSpyObj('Client', ['newBatch']);
      mockClient.newBatch.and.returnValue(Promise.resolve(mockBatch));
      spyOn(library, 'client').and.returnValue(Promise.resolve(mockClient));

      await library['flushRequests_']();
      assert(mockWindow.clearTimeout).to.haveBeenCalledWith(existingTimeoutId);
      assert(GapiLibrary['timeoutId_']).to.beNull();
    });
  });

  describe('get', () => {
    it(`should resolve with the correct object`, async () => {
      const obj = Mocks.object('obj');
      mockGapi.init.and.returnValue(Promise.resolve({[NAME]: obj}));

      await assert(library.get()).to.resolveWith(obj);
      assert(mockGapi.init).to.haveBeenCalledWith();
    });

    it(`should reject if the object does not exist`, async () => {
      mockGapi.init.and.returnValue(Promise.resolve({}));

      await assert(library.get()).to.rejectWithError(/should exist/);
      assert(mockGapi.init).to.haveBeenCalledWith();
    });
  });

  describe('queueRequest', () => {
    it(`should resolve correctly when the queued callback has been called`, async () => {
      const request = Mocks.object('request');
      const result = Mocks.object('result');
      const timeoutId = 123;
      mockWindow.setTimeout.and.returnValue(timeoutId);

      spyOn(library, 'flushRequests_');

      const promise = library.queueRequest(request);
      QUEUED_REQUESTS.get(request)!(result);
      assert(await promise).to.equal(result);

      assert(GapiLibrary['timeoutId_']).to.equal(timeoutId);
      mockWindow.setTimeout.calls.argsFor(0)[0]();
      assert(library['flushRequests_']).to.haveBeenCalledWith();
    });

    it(`should reject correctly when the queued callback has been called with an Error`,
        async () => {
      const request = Mocks.object('request');
      const result = new Error('error');
      const timeoutId = 123;
      mockWindow.setTimeout.and.returnValue(timeoutId);

      spyOn(library, 'flushRequests_');

      const promise = library.queueRequest(request);
      QUEUED_REQUESTS.get(request)!(result);
      await assert(promise).to.rejectWithError(/error/);

      assert(GapiLibrary['timeoutId_']).to.equal(timeoutId);
      mockWindow.setTimeout.calls.argsFor(0)[0]();
      assert(library['flushRequests_']).to.haveBeenCalledWith();
    });

    it(`should not set the timeout if it already exists`, async () => {
      const request = Mocks.object('request');
      const timeoutId = 123;
      GapiLibrary['timeoutId_'] = timeoutId;

      spyOn(library, 'flushRequests_');

      library.queueRequest(request);

      assert(GapiLibrary['timeoutId_']).to.equal(timeoutId);
      assert(mockWindow.setTimeout).toNot.haveBeenCalled();
    });
  });

  describe('static create', () => {
    it(`should resolve with the library correctly`, async () => {
      const name = 'name';
      const discoveryDocs = Mocks.object('discoveryDocs');
      const scopes = Mocks.object('scopes');

      const library = await GapiLibrary.create(
          mockGapi,
          discoveryDocs,
          scopes,
          name,
          false /* signIn */);
      assert(library).to.beAnInstanceOf(GapiLibrary);
      assert(mockGapi.addSignIn).toNot.haveBeenCalled();
      assert(mockGapi.addDiscoveryDocs).to.haveBeenCalledWith(discoveryDocs);
      assert(mockGapi.addScopes).to.haveBeenCalledWith(scopes);
    });

    it(`should sign in if set`, async () => {
      const name = 'name';
      const discoveryDocs = Mocks.object('discoveryDocs');
      const scopes = Mocks.object('scopes');

      const library = await GapiLibrary.create(
          mockGapi,
          discoveryDocs,
          scopes,
          name,
          true /* signIn */);
      assert(library).to.beAnInstanceOf(GapiLibrary);
      assert(mockGapi.addSignIn).to.haveBeenCalledWith();
      assert(mockGapi.addDiscoveryDocs).to.haveBeenCalledWith(discoveryDocs);
      assert(mockGapi.addScopes).to.haveBeenCalledWith(scopes);
    });
  });
});
