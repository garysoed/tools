import { assert, match, should } from 'gs-testing/export/main';
import { mocks } from 'gs-testing/export/mock';
import { createSpy, createSpyObject, fake, SpyObj } from 'gs-testing/export/spy';
import { spy } from 'gs-testing/export/spy';
import { Gapi } from './gapi';
import { GapiError } from './gapi-error';
import { GapiLibrary, QUEUED_REQUESTS } from './gapi-library';


describe('net.GapiLibrary', () => {
  const NAME = 'name';
  let mockGapi: SpyObj<Gapi>;
  let mockWindow: SpyObj<Window>;
  let library: GapiLibrary<number>;

  beforeEach(() => {
    mockGapi = createSpyObject(
        'Gapi',
        ['addDiscoveryDocs', 'addScopes', 'addSignIn', 'init']);
    mockWindow = createSpyObject('Window', ['clearTimeout', 'setTimeout']);
    library = new GapiLibrary(mockGapi, NAME, mockWindow);
    QUEUED_REQUESTS.clear();
    GapiLibrary['timeoutId_'] = null;
  });

  describe('flushRequests_', () => {
    should(`call the callback on all the queued callbacks`, async () => {
      const mockCallback1 = createSpy('Callback1');
      const mockCallback2 = createSpy('Callback2');
      const request1 = mocks.object<gapi.client.HttpRequest<any>>('request1');
      const request2 = mocks.object<gapi.client.HttpRequest<any>>('request2');
      QUEUED_REQUESTS.set(request1, mockCallback1);
      QUEUED_REQUESTS.set(request2, mockCallback2);

      const result1 = mocks.object('result1');
      const result2 = mocks.object('result2');
      const responseMap = new Map([[request1, result1], [request2, result2]]);

      const batches = new Map();
      const mockBatchAdd = createSpy<void, [gapi.client.HttpRequest<any>, {id: string}]>(
          'BatchAdd');
      fake(mockBatchAdd).always()
          .call((request: any, config: {id: any}) => batches.set(request, config.id));

      const mockBatch = new Promise(resolve => {
        const intervalId = window.setInterval(() => {
          const result = {};
          for (const [request, response] of responseMap) {
            const batchId = batches.get(request);
            if (!batchId) {
              return;
            }

            (result as any)[batchId] = {result: response, status: 200};
          }

          window.clearInterval(intervalId);
          resolve({
            result,
            status: 200,
          });
        },                                    0);
      });
      (mockBatch as any)['add'] = mockBatchAdd;

      const mockClient = createSpyObject<gapi.Client>('Client', ['newBatch']);
      // TODO: Remove typecast.
      fake(mockClient.newBatch).always().return(Promise.resolve(mockBatch) as any);
      fake(spy(library, 'client')).always().return(Promise.resolve(mockClient));

      await library['flushRequests_']();
      assert(mockCallback1).to.haveBeenCalledWith(result1);
      assert(mockCallback2).to.haveBeenCalledWith(result2);
      assert(mockBatchAdd).to.haveBeenCalledWith(request1, match.anyThing());
      assert(mockBatchAdd).to.haveBeenCalledWith(request2, match.anyThing());
      assert(QUEUED_REQUESTS).to.haveElements([]);
    });

    should(`handle errors correctly on failed requests`, async () => {
      const mockCallback1 = createSpy('Callback1');
      const mockCallback2 = createSpy('Callback2');
      const request1 = mocks.object<gapi.client.HttpRequest<any>>('request1');
      const request2 = mocks.object<gapi.client.HttpRequest<any>>('request2');
      QUEUED_REQUESTS.set(request1, mockCallback1);
      QUEUED_REQUESTS.set(request2, mockCallback2);

      const result1 = mocks.object('result1');
      const result2 = mocks.object('result2');
      const responseMap = new Map([[request1, result1], [request2, result2]]);

      const batches = new Map();
      const mockBatchAdd = createSpy<void, [gapi.client.HttpRequest<any>, {id: string}]>(
          'BatchAdd');
      fake(mockBatchAdd).always()
          .call((request: any, config: {id: any}) => batches.set(request, config.id));

      const mockBatch = new Promise(resolve => {
        const intervalId = window.setInterval(() => {
          const result = {};
          for (const [request, response] of responseMap) {
            const batchId = batches.get(request);
            if (!batchId) {
              return;
            }

            (result as any)[batchId] = {result: response, status: 500};
          }

          window.clearInterval(intervalId);
          resolve({
            result,
            status: 200,
          });
        },                                    0);
      });
      (mockBatch as any)['add'] = mockBatchAdd;

      const mockClient = createSpyObject<gapi.Client>('Client', ['newBatch']);
      // TODO: Remove typecast.
      fake(mockClient.newBatch).always().return(Promise.resolve(mockBatch) as any);
      fake(spy(library, 'client')).always().return(Promise.resolve(mockClient));

      await library['flushRequests_']();
      assert(mockCallback1).to.haveBeenCalledWith(match.anyObjectThat().beAnInstanceOf(GapiError));
      assert(mockCallback2).to.haveBeenCalledWith(match.anyObjectThat().beAnInstanceOf(GapiError));
      assert(mockBatchAdd).to.haveBeenCalledWith(request1, match.anyThing());
      assert(mockBatchAdd).to.haveBeenCalledWith(request2, match.anyThing());
      assert(QUEUED_REQUESTS).to.haveElements([]);
    });

    should(`pass errors on all callbacks if the entire batch fails`, async () => {
      const mockCallback1 = createSpy('Callback1');
      const mockCallback2 = createSpy('Callback2');
      const request1 = mocks.object<gapi.client.HttpRequest<any>>('request1');
      const request2 = mocks.object<gapi.client.HttpRequest<any>>('request2');
      QUEUED_REQUESTS.set(request1, mockCallback1);
      QUEUED_REQUESTS.set(request2, mockCallback2);

      const mockBatchAdd = createSpy('BatchAdd');

      const mockBatch = Promise.resolve({
        status: 500,
      });
      (mockBatch as any)['add'] = mockBatchAdd;

      const mockClient = createSpyObject<gapi.Client>('Client', ['newBatch']);
      // TODO: Remove typecast.
      fake(mockClient.newBatch).always().return(Promise.resolve(mockBatch) as any);
      fake(spy(library, 'client')).always().return(Promise.resolve(mockClient));

      await library['flushRequests_']();
      assert(mockCallback1).to.haveBeenCalledWith(match.anyObjectThat().beAnInstanceOf(GapiError));
      assert(mockCallback2).to.haveBeenCalledWith(match.anyObjectThat().beAnInstanceOf(GapiError));
      assert(mockBatchAdd).to.haveBeenCalledWith(request1, match.anyThing());
      assert(mockBatchAdd).to.haveBeenCalledWith(request2, match.anyThing());
      assert(QUEUED_REQUESTS).to.haveElements([]);
    });

    should(`clear the previous timeout IDs`, async () => {
      const existingTimeoutId = 123;
      GapiLibrary['timeoutId_'] = existingTimeoutId;

      const mockBatchAdd = createSpy('BatchAdd');
      const mockBatch = Promise.resolve({
        status: 500,
      });
      (mockBatch as any)['add'] = mockBatchAdd;

      const mockClient = createSpyObject<gapi.Client>('Client', ['newBatch']);
      // TODO: Remove typecast.
      fake(mockClient.newBatch).always().return(Promise.resolve(mockBatch) as any);
      fake(spy(library, 'client')).always().return(Promise.resolve(mockClient));

      await library['flushRequests_']();
      assert(mockWindow.clearTimeout).to.haveBeenCalledWith(existingTimeoutId);
      assert(GapiLibrary['timeoutId_']).to.beNull();
    });
  });

  describe('get', () => {
    should(`resolve with the correct object`, async () => {
      const obj = 123;

      // TODO: Remove typecast
      fake(mockGapi.init).always().return(Promise.resolve({[NAME]: obj} as any));

      await assert(library.get()).to.resolveWith(obj);
      assert(mockGapi.init).to.haveBeenCalledWith();
    });

    should(`reject if the object does not exist`, async () => {
      // TODO: Remove typecast
      fake(mockGapi.init).always().return(Promise.resolve({} as any));

      await assert(library.get()).to.rejectWithErrorMessage(/should exist/);
      assert(mockGapi.init).to.haveBeenCalledWith();
    });
  });

  describe('queueRequest', () => {
    should(`resolve correctly when the queued callback has been called`, async () => {
      const request = mocks.object<gapi.client.HttpRequest<any>>('request');
      const result = mocks.object('result');
      const timeoutId = 123;
      fake(mockWindow.setTimeout).always().call(fn => {
        fn();

        return timeoutId;
      });

      // TODO: Make flushRequests_ private
      const flushRequestsSpy = spy(library, 'flushRequests_');

      const promise = library.queueRequest(request);
      // tslint:disable-next-line:no-non-null-assertion
      QUEUED_REQUESTS.get(request)!(result);
      assert(await promise).to.equal(result);

      assert(GapiLibrary['timeoutId_']).to.equal(timeoutId);
      assert(flushRequestsSpy).to.haveBeenCalledWith();
    });

    should(`reject correctly when the queued callback has been called with an Error`,
           async () => {
      const request = mocks.object<gapi.client.HttpRequest<any>>('request');
      const result = new Error('error');
      const timeoutId = 123;
      fake(mockWindow.setTimeout).always().call(fn => {
        fn();

        return timeoutId;
      });

      // TODO: Make flushRequests_ private
      const flushRequestsSpy = spy(library, 'flushRequests_');

      const promise = library.queueRequest(request);
      // tslint:disable-next-line:no-non-null-assertion
      QUEUED_REQUESTS.get(request)!(result);
      await assert(promise).to.rejectWithErrorMessage(/error/);

      assert(GapiLibrary['timeoutId_']).to.equal(timeoutId);
      assert(flushRequestsSpy).to.haveBeenCalledWith();
    });

    should(`not set the timeout if it already exists`, async () => {
      const request = mocks.object<gapi.client.HttpRequest<any>>('request');
      const timeoutId = 123;
      GapiLibrary['timeoutId_'] = timeoutId;

      spy(library, 'flushRequests_');

      library.queueRequest(request);

      assert(GapiLibrary['timeoutId_']).to.equal(timeoutId);
      assert(mockWindow.setTimeout).toNot.haveBeenCalled();
    });
  });

  describe('static create', () => {
    should(`resolve with the library correctly`, async () => {
      const name = 'name';
      const discoveryDocs = ['discoveryDocs'];
      const scopes = ['scopes'];

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

    should(`sign in if set`, async () => {
      const name = 'name';
      const discoveryDocs = ['discoveryDocs'];
      const scopes = ['scopes'];

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
