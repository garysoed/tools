import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ImmutableList } from '../immutable/immutable-list';
import { TestDispose } from '../testing/test-dispose';
import { LocationServiceImpl } from '../ui/location-service';
import { LocationServiceEvents } from '../ui/location-service-events';
import { Locations } from '../ui/locations';
import { Reflect } from '../util/reflect';


describe('ui.LocationService', () => {
  let mockLocation: any;
  let mockWindow: any;
  let service: LocationServiceImpl;

  beforeEach(() => {
    mockLocation = {hash: ''};
    mockWindow = {location: mockLocation};

    service = new LocationServiceImpl(mockWindow);
    TestDispose.add(service);
  });

  describe('[Reflect.__initialize]', () => {
    it('should listen to the hashchange event', () => {
      const mockDisposable = jasmine.createSpyObj('Disposable', ['dispose']);
      spyOn(service['window_'], 'on').and.returnValue(mockDisposable);

      service[Reflect.__initialize]();

      assert(service['window_'].on).to
          .haveBeenCalledWith('hashchange', service['onHashChange_'], service);
    });
  });

  describe('appendParts', () => {
    it('should combine the parts together', () => {
      assert(service.appendParts(ImmutableList.of(['a', 'b/', '/c', '.', '/d/e/'])))
          .to.equal('/a/b/c/d/e');
    });

    it('should return "/" if there path is empty', () => {
      assert(service.appendParts(ImmutableList.of(['.', '']))).to.equal('/');
    });
  });

  describe('goTo', () => {
    it('should set the location with the normalized path', () => {
      const path = 'path';
      const normalizedPath = 'normalizedPath';
      spyOn(Locations, 'normalizePath').and.returnValue(normalizedPath);
      service.goTo(path);

      assert(mockLocation.hash).to.equal(normalizedPath);
      assert(Locations.normalizePath).to.haveBeenCalledWith(path);
    });
  });

  describe('hasMatch', () => {
    it('should return true if there are matches', () => {
      const matcher = 'matcher';
      spyOn(service, 'getMatches').and.returnValue({});
      assert(service.hasMatch(matcher)).to.beTrue();
      assert(service.getMatches).to.haveBeenCalledWith(matcher);
    });

    it('should return false if there are no matches', () => {
      const matcher = 'matcher';
      spyOn(service, 'getMatches').and.returnValue(null);
      assert(service.hasMatch(matcher)).to.beFalse();
      assert(service.getMatches).to.haveBeenCalledWith(matcher);
    });
  });

  describe('onHashChange_', () => {
    it('should dispatch the CHANGED event', () => {
      spyOn(service, 'dispatch');

      service['onHashChange_']();

      assert(service.dispatch).to.haveBeenCalledWith({type: LocationServiceEvents.CHANGED});
    });
  });
});
