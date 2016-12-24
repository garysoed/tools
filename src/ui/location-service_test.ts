import {assert, TestBase} from 'src/test-base';
TestBase.setup();

import {DomEvent} from 'src/event/dom-event';
import {Mocks} from 'src/mock/mocks';
import {TestDispose} from 'src/testing/test-dispose';
import {Reflect} from 'src/util/reflect';

import {LocationService} from './location-service';
import {LocationServiceEvents} from './location-service-events';
import {Locations} from './locations';


describe('ui.LocationService', () => {
  let mockLocation;
  let mockWindow;
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
      spyOn(mockWindow, 'on').and.callThrough();

      service[Reflect.__initialize]();

      assert(mockWindow.on).to
          .haveBeenCalledWith(DomEvent.HASHCHANGE, service['onHashChange_'], service);
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
      let path = 'path';
      let normalizedPath = 'normalizedPath';
      spyOn(Locations, 'normalizePath').and.returnValue(normalizedPath);
      service.goTo(path);

      assert(mockLocation.hash).to.equal(normalizedPath);
      assert(Locations.normalizePath).to.haveBeenCalledWith(path);
    });
  });

  describe('hasMatch', () => {
    it('should return true if there are matches', () => {
      let matcher = 'matcher';
      spyOn(service, 'getMatches').and.returnValue({});
      assert(service.hasMatch(matcher)).to.beTrue();
      assert(service.getMatches).to.haveBeenCalledWith(matcher);
    });

    it('should return false if there are no matches', () => {
      let matcher = 'matcher';
      spyOn(service, 'getMatches').and.returnValue(null);
      assert(service.hasMatch(matcher)).to.beFalse();
      assert(service.getMatches).to.haveBeenCalledWith(matcher);
    });
  });

  describe('appendParts', () => {
    it('should combine the parts together', () => {
      assert(LocationService.appendParts(['a', 'b/', '/c', '.', '/d/e/'])).to.equal('/a/b/c/d/e');
    });

    it('should return "/" if there path is empty', () => {
      assert(LocationService.appendParts(['.', ''])).to.equal('/');
    });
  });
});
