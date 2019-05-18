// import { assert, match, should, test } from '@gs-testing';
// import { createSpyObject, fake, Spy, SpyObj } from '@gs-testing';
// import { Gapi } from '.';

// interface Auth2Type {
//   getAuthInstance(): gapi.auth2.Instance;
// }
// interface GapiType {
//   auth2: Auth2Type;
//   client: gapi.Client;
//   load(lib: string, handler: () => void): void;
// }

// test.skip('net.Gapi', () => {
//   const API_KEY = 'apiKey';
//   const CLIENT_ID = 'clientId';
//   // TODO: Remove the any types here.
//   let mockAuth2: SpyObj<Auth2Type>;
//   let mockClient: SpyObj<gapi.Client>;
//   let mockGapi: SpyObj<GapiType>;
//   let gapi: Gapi;

//   beforeEach(() => {
//     mockAuth2 = createSpyObject('Auth2', ['getAuthInstance']);
//     mockClient = createSpyObject('Client', ['init']);
//     mockGapi = createSpyObject('Gapi', ['load']);
//     mockGapi.auth2 = mockAuth2;
//     mockGapi.client = mockClient;

//     // TODO: Remove typecast
//     (window as any)['gapi'] = mockGapi;

//     gapi = new Gapi(API_KEY, CLIENT_ID);
//   });

//   test('addDiscoveryDocs', () => {
//     should(`add the discovery docs`, () => {
//       const doc1 = 'doc1';
//       const doc2 = 'doc2';

//       gapi.addDiscoveryDocs([doc1, doc2]);
//       assert(gapi['discoveryDocs_']).to.haveElements([doc1, doc2]);
//     });

//     should(`throw error if initialized`, () => {
//       gapi['initialized_'] = true;

//       assert(() => {
//         gapi.addDiscoveryDocs([]);
//       }).to.throwErrorWithMessage(/initialized/);
//     });
//   });

//   test('addScopes', () => {
//     should(`add the scopes`, () => {
//       const scope1 = 'scope1';
//       const scope2 = 'scope2';

//       gapi.addScopes([scope1, scope2]);
//       assert(gapi['scopes_']).to.haveElements([scope1, scope2]);
//     });

//     should(`throw error if initialized`, () => {
//       gapi['initialized_'] = true;

//       assert(() => {
//         gapi.addScopes([]);
//       }).to.throwErrorWithMessage(/initialized/);
//     });
//   });

//   test('addSignIn', () => {
//     should(`set the sign in flag`, () => {
//       gapi.addSignIn();
//       assert(gapi['signIn_']).to.beTrue();
//     });

//     should(`throw error if initialized`, () => {
//       gapi['initialized_'] = true;

//       assert(() => {
//         gapi.addSignIn();
//       }).to.throwErrorWithMessage(/initialized/);
//     });
//   });

//   test('init', () => {
//     should(`initialize correctly`, async () => {
//       const doc1 = 'doc1';
//       const doc2 = 'doc2';
//       gapi.addDiscoveryDocs([doc1, doc2]);

//       const scope1 = 'scope1';
//       const scope2 = 'scope2';
//       gapi.addScopes([scope1, scope2]);

//       // TODO: Figure out the correct type.
//       const mockGapiLoad = mockGapi.load as Spy<any, [any, () => any]>;
//       fake(mockGapiLoad).always().call((_: any, handler: () => any) => handler());

//       fake(mockClient.init).always().return(Promise.resolve());

//       await assert(gapi.init()).to.resolveWith(mockClient);
//       assert(gapi['initialized_']).to.beTrue();
//       assert(mockClient.init).to.haveBeenCalledWith(
//           match.anyObjectThat<gapi.ClientInitConfig>().haveProperties({
//             apiKey: API_KEY,
//             clientId: CLIENT_ID,
//             discoveryDocs: match.anyArrayThat().haveExactElements([doc1, doc2]),
//             scope: `${scope1} ${scope2}`,
//           }));
//       assert(mockGapiLoad).to.haveBeenCalledWith(
//           'client:auth2',
//           match.anyThat<() => any>().beAFunction(),
//       );
//     });

//     should(`initialize correctly if the sign in key was set`, async () => {
//       const doc = 'doc';
//       gapi.addDiscoveryDocs([doc]);

//       const scope = 'scope';
//       gapi.addScopes([scope]);
//       gapi.addSignIn();

//       // TODO: Figure out the correct type.
//       const mockGapiLoad = mockGapi.load as Spy<any, [any, () => any]>;
//       fake(mockGapiLoad).always().call((_: any, handler: () => any) => handler());

//       fake(mockClient.init).always().return(Promise.resolve());

//       const mockAuthInstance = createSpyObject<gapi.auth2.Instance>(
//           'AuthInstance',
//           ['isSignedIn', 'signIn'],
//       );
//       mockAuthInstance.isSignedIn = {get: () => false};
//       fake(mockAuthInstance.signIn).always().return(Promise.resolve());
//       fake(mockAuth2.getAuthInstance).always().return(mockAuthInstance);

//       await assert(gapi.init()).to.resolveWith(mockClient);
//       assert(gapi['initialized_']).to.beTrue();
//       assert(mockAuthInstance.signIn).to.haveBeenCalledWith();
//       assert(mockClient.init).to.haveBeenCalledWith(
//           match.anyObjectThat<gapi.ClientInitConfig>().haveProperties({
//             apiKey: API_KEY,
//             clientId: CLIENT_ID,
//             discoveryDocs: match.anyArrayThat().haveExactElements([doc]),
//             scope: `${scope}`,
//           }));
//       assert(mockGapiLoad).to.haveBeenCalledWith(
//           'client:auth2',
//           match.anyThat<() => any>().beAFunction(),
//       );
//     });

//     should(`not sign in if already signed in`, async () => {
//       const doc = 'doc';
//       gapi.addDiscoveryDocs([doc]);

//       const scope = 'scope';
//       gapi.addScopes([scope]);
//       gapi.addSignIn();

//       // TODO: Figure out the correct type.
//       const mockGapiLoad = mockGapi.load as Spy<any, [any, () => any]>;
//       fake(mockGapiLoad).always().call((_: any, handler: () => any) => handler());

//       fake(mockClient.init).always().return(Promise.resolve());

//       const mockAuthInstance = createSpyObject<gapi.auth2.Instance>(
//           'AuthInstance',
//           ['isSignedIn', 'signIn'],
//       );
//       mockAuthInstance.isSignedIn = {get: () => true};
//       fake(mockAuthInstance.signIn).always().return(Promise.resolve());
//       fake(mockAuth2.getAuthInstance).always().return(mockAuthInstance);

//       await assert(gapi.init()).to.resolveWith(mockClient);
//       assert(gapi['initialized_']).to.beTrue();
//       assert(mockAuthInstance.signIn).toNot.haveBeenCalled();
//       assert(mockClient.init).to.haveBeenCalledWith(
//           match.anyObjectThat<gapi.ClientInitConfig>().haveProperties({
//             apiKey: API_KEY,
//             clientId: CLIENT_ID,
//             discoveryDocs: match.anyArrayThat().haveExactElements([doc]),
//             scope: `${scope}`,
//           }));
//       assert(mockGapiLoad).to.haveBeenCalledWith(
//           'client:auth2',
//           match.anyThat<() => any>().beAFunction(),
//       );
//     });
//   });
// });
