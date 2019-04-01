// import { assert, match, retryUntil, should, test } from '@gs-testing/main';
// import { mocks } from '@gs-testing/mock';
// import { createSpy, createSpyObject, fake, Spy, SpyObj } from '@gs-testing/spy';
// import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
// import { createImmutableSet, ImmutableSet } from '../collect/types/immutable-set';
// import { GapiLibrary } from '../net';
// import { GapiRequestQueue, GapiStorage } from './gapi-storage';

// class TestGapiStorage extends GapiStorage<{}, {}, {}, {}, {}> {
//   constructor(
//       library: GapiLibrary<{}>,
//       private readonly mockHasImpl_: Spy<Observable<boolean>, [GapiRequestQueue<{}, {}>, string]>,
//       private readonly mockListIdsImpl_:
//           Spy<Observable<ImmutableSet<string>>, [GapiRequestQueue<{}, {}>]>,
//       private readonly mockReadImpl_:
//           Spy<Observable<{}|null>, [GapiRequestQueue<{}, {}>, string]>,
//   ) {
//     super(library);
//   }

//   hasImpl_(queueRequest: GapiRequestQueue<{}, {}>, id: string): Observable<boolean> {
//     return this.mockHasImpl_(queueRequest, id);
//   }

//   listIdsImpl_(queueRequest: GapiRequestQueue<{}, {}>): Observable<ImmutableSet<string>> {
//     return this.mockListIdsImpl_(queueRequest);
//   }

//   readImpl_(queueRequest: GapiRequestQueue<{}, {}>, id: string): Observable<{} | null> {
//     return this.mockReadImpl_(queueRequest, id);
//   }
// }

// test.skip('store.GapiStorage', () => {
//   let mockLibrary: SpyObj<GapiLibrary<{}>>;
//   let mockHasImpl_: Spy<Observable<boolean>, [GapiRequestQueue<{}, {}>, string]>;
//   let mockListIdsImpl_: Spy<Observable<ImmutableSet<string>>, [GapiRequestQueue<{}, {}>]>;
//   let mockReadImpl_: Spy<Observable<{}|null>, [GapiRequestQueue<{}, {}>, string]>;
//   let storage: TestGapiStorage;

//   beforeEach(() => {
//     mockLibrary = createSpyObject('Library', ['get', 'queueRequest']);
//     mockHasImpl_ = createSpy('HasImpl_');
//     mockListIdsImpl_ = createSpy('ListIdsImpl_');
//     mockReadImpl_ = createSpy('ReadImpl_');
//     storage = new TestGapiStorage(mockLibrary, mockHasImpl_, mockListIdsImpl_, mockReadImpl_);
//   });

//   test('has', () => {
//     should(`emit correctly`, async () => {
//       const id = 'id';

//       fake(mockHasImpl_).always().return(observableOf(true));

//       const hasSubject = new BehaviorSubject<boolean|null>(null);
//       storage.has(id).subscribe(hasSubject);

//       // tslint:disable-next-line:no-non-null-assertion
//       assert(hasSubject.getValue()!).to.beTrue();

//       const requestQueueMatcher = match
//           .anyObjectThat<GapiRequestQueue<{}, {}>>()
//           .beAFunction();
//       assert(mockHasImpl_).to.haveBeenCalledWith(requestQueueMatcher, id);

//       const request = mocks.object('request');
//       fake(mockLibrary.queueRequest).always().return(Promise.resolve(request));
//       const lib = mocks.object('lib');
//       fake(mockLibrary.get).always().return(Promise.resolve(lib));

//       const mockFn = createSpy<gapi.client.HttpRequest<{}>, [{}]>('Fn');
//       requestQueueMatcher.getLastMatch()(mockFn);
//       await retryUntil(() => mockFn).to.equal(match.anySpyThat().haveBeenCalledWith(lib));
//     });
//   });

//   test('listIds', () => {
//     should(`resolve correctly`, async () => {
//       const listIds = createImmutableSet(['itemId']);
//       fake(mockListIdsImpl_).always().return(observableOf(listIds));

//       const listIdsSubject = new BehaviorSubject<ImmutableSet<string>>(createImmutableSet());
//       storage.listIds().subscribe(listIdsSubject);

//       // tslint:disable-next-line:no-non-null-assertion
//       assert(listIdsSubject.getValue()!()).to.haveElements('itemId');

//       const requestQueueMatcher = match
//           .anyObjectThat<GapiRequestQueue<{}, {}>>()
//           .beAFunction();
//       assert(mockListIdsImpl_).to.haveBeenCalledWith(requestQueueMatcher);

//       const request = mocks.object('request');
//       fake(mockLibrary.queueRequest).always().return(Promise.resolve(request));
//       const lib = mocks.object('lib');
//       fake(mockLibrary.get).always().return(Promise.resolve(lib));

//       const mockFn = createSpy<gapi.client.HttpRequest<{}>, [{}]>('Fn');
//       requestQueueMatcher.getLastMatch()(mockFn);
//       await retryUntil(() => mockFn).to.equal(match.anySpyThat().haveBeenCalledWith(lib));
//     });
//   });

//   test('read', () => {
//     should(`resolve correctly`, async () => {
//       const id = 'id';
//       const item = mocks.object('item');

//       fake(mockReadImpl_).always().return(observableOf(item));

//       const readSubject = new BehaviorSubject<{}|null>(null);
//       storage.read(id).subscribe(readSubject);

//       // tslint:disable-next-line:no-non-null-assertion
//       assert(readSubject.getValue()!).to.equal(item);

//       const requestQueueMatcher = match
//           .anyObjectThat<GapiRequestQueue<{}, {}>>()
//           .beAFunction();
//       assert(mockReadImpl_).to.haveBeenCalledWith(requestQueueMatcher, id);

//       const request = mocks.object('request');
//       fake(mockLibrary.queueRequest).always().return(Promise.resolve(request));
//       const lib = mocks.object('lib');
//       fake(mockLibrary.get).always().return(Promise.resolve(lib));

//       const mockFn = createSpy<gapi.client.HttpRequest<{}>, [{}]>('Fn');
//       requestQueueMatcher.getLastMatch()(mockFn);
//       await retryUntil(() => mockFn).to.equal(match.anySpyThat().haveBeenCalledWith(lib));
//     });
//   });
// });
