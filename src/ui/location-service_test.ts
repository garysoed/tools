import { assert, TestBase } from '../test-base';
TestBase.setup();

import { DomEvent } from '../event/dom-event';
import { ImmutableList } from '../immutable/immutable-list';
import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';
import { LocationService } from '../ui/location-service';
import { LocationServiceEvents } from '../ui/location-service-events';
import { Locations } from '../ui/locations';
import { Reflect } from '../util/reflect';


describe('ui.LocationService', () => {
  let mockLocation: any;
  let mockWindow: any;
  let service: LocationService;

  beforeEach(() => {
    mockLocation = {hash: ''};
    mockWindow = Mocks.listenable('window', {location: mockLocation});

    service = new LocationService(mockWindow);
    TestDispose.add(service);
  });

  describe('[Reflect.__initialize]', () => {
    it('should listen to the hashchange event', () => {
      spyOn(service, 'onHashChange_');
      spyOn(service, 'listenTo');

      service[Reflect.__initialize]();

      assert(service.listenTo).to
          .haveBeenCalledWith(mockWindow, DomEvent.HASHCHANGE, service['onHashChange_']);
    });
  });

  describe('onHashChange_', () => {
    it('should dispatch the CHANGED event', () => {
      spyOn(service, 'dispatch');

      service['onHashChange_']();

      assert(service.dispatch).to.haveBeenCalledWith(LocationServiceEvents.CHANGED);
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

  describe('appendParts', () => {
    it('should combine the parts together', () => {
      assert(LocationService.appendParts(ImmutableList.of(['a', 'b/', '/c', '.', '/d/e/'])))
          .to.equal('/a/b/c/d/e');
    });

    it('should return "/" if there path is empty', () => {
      assert(LocationService.appendParts(ImmutableList.of(['.', '']))).to.equal('/');
    });
  });
});
