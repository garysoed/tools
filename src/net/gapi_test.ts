import { assert, Fakes, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { Gapi } from '../net';


describe('net.Gapi', () => {
  const API_KEY = 'apiKey';
  const CLIENT_ID = 'clientId';
  let mockAuth2: any;
  let mockClient: any;
  let mockGapi: any;
  let gapi: Gapi;

  beforeEach(() => {
    mockAuth2 = jasmine.createSpyObj('Auth2', ['getAuthInstance']);
    mockClient = jasmine.createSpyObj('Client', ['init']);
    mockGapi = jasmine.createSpyObj('Gapi', ['load']);
    mockGapi.auth2 = mockAuth2;
    mockGapi.client = mockClient;
    window['gapi'] = mockGapi;

    gapi = new Gapi(API_KEY, CLIENT_ID);
  });

  describe('addDiscoveryDocs', () => {
    it(`should add the discovery docs`, () => {
      const doc1 = Mocks.object('doc1');
      const doc2 = Mocks.object('doc2');

      gapi.addDiscoveryDocs([doc1, doc2]);
      assert(gapi['discoveryDocs_']).to.haveElements([doc1, doc2]);
    });

    it(`should throw error if initialized`, () => {
      gapi['initialized_'] = true;

      assert(() => {
        gapi.addDiscoveryDocs([]);
      }).to.throwError(/initialized/);
    });
  });

  describe('addScopes', () => {
    it(`should add the scopes`, () => {
      const scope1 = Mocks.object('scope1');
      const scope2 = Mocks.object('scope2');

      gapi.addScopes([scope1, scope2]);
      assert(gapi['scopes_']).to.haveElements([scope1, scope2]);
    });

    it(`should throw error if initialized`, () => {
      gapi['initialized_'] = true;

      assert(() => {
        gapi.addScopes([]);
      }).to.throwError(/initialized/);
    });
  });

  describe('addSignIn', () => {
    it(`should set the sign in flag`, () => {
      gapi.addSignIn();
      assert(gapi['signIn_']).to.beTrue();
    });

    it(`should throw error if initialized`, () => {
      gapi['initialized_'] = true;

      assert(() => {
        gapi.addSignIn();
      }).to.throwError(/initialized/);
    });
  });

  describe('init', () => {
    it(`should initialize correctly`, async () => {
      const doc1 = 'doc1';
      const doc2 = 'doc2';
      gapi.addDiscoveryDocs([doc1, doc2]);

      const scope1 = 'scope1';
      const scope2 = 'scope2';
      gapi.addScopes([scope1, scope2]);

      Fakes.build(mockGapi.load)
          .when(Matchers.anyString(), Matchers.anyFunction())
              .call((_: any, handler: () => any) => handler());

      mockClient.init.and.returnValue(Promise.resolve());

      await assert(gapi.init()).to.resolveWith(mockClient);
      assert(gapi['initialized_']).to.beTrue();
      assert(mockClient.init).to.haveBeenCalledWith({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: [doc1, doc2],
        scope: `${scope1} ${scope2}`,
      });
      assert(mockGapi.load).to.haveBeenCalledWith('client:auth2', Matchers.anyFunction());
    });

    it(`should initialize correctly if the sign in key was set`, async () => {
      const doc = 'doc';
      gapi.addDiscoveryDocs([doc]);

      const scope = 'scope';
      gapi.addScopes([scope]);
      gapi.addSignIn();

      Fakes.build(mockGapi.load)
          .when(Matchers.anyString(), Matchers.anyFunction())
              .call((_: any, handler: () => any) => handler());

      mockClient.init.and.returnValue(Promise.resolve());

      const mockAuthInstance = jasmine.createSpyObj('AuthInstance', ['signIn']);
      mockAuthInstance.signIn.and.returnValue(Promise.resolve());
      mockAuth2.getAuthInstance.and.returnValue(mockAuthInstance);

      await assert(gapi.init()).to.resolveWith(mockClient);
      assert(gapi['initialized_']).to.beTrue();
      assert(mockAuthInstance.signIn).to.haveBeenCalledWith();
      assert(mockClient.init).to.haveBeenCalledWith({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: [doc],
        scope: `${scope}`,
      });
      assert(mockGapi.load).to.haveBeenCalledWith('client:auth2', Matchers.anyFunction());
    });
  });
});
