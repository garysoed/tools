import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { GapiLibrary } from '../net';


describe('net.GapiLibrary', () => {
  const NAME: string = 'name';
  let mockGapi: any;
  let library: GapiLibrary<number>;

  beforeEach(() => {
    mockGapi = jasmine.createSpyObj(
        'Gapi',
        ['addDiscoveryDocs', 'addScopes', 'addSignIn', 'init']);
    library = new GapiLibrary(mockGapi, NAME);
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

      await assert(library.get()).to.rejectWithError(/to exist/);
      assert(mockGapi.init).to.haveBeenCalledWith();
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
