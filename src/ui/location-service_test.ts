import {assert, Matchers, TestBase} from '../test-base';
TestBase.setup();

import {DomEvent} from '../event/dom-event';
import {LocationService} from './location-service';
import {LocationServiceEvents} from './location-service-events';
import {Mocks} from '../mock/mocks';
import {Reflect} from '../util/reflect';
import {TestDispose} from '../testing/test-dispose';


describe('ui.LocationService', () => {
  let mockLocation;
  let mockWindow;
  let service: LocationService;

  beforeEach(() => {
    mockLocation = {hash: ''};
    mockWindow = Mocks.disposable('Window');
    mockWindow.getEventTarget = () => {
      return {location: mockLocation};
    };
    mockWindow.on = jasmine.createSpy('on');
    mockWindow.getEventTarget;

    service = new LocationService(mockWindow);
    TestDispose.add(service);
  });

  describe('[Reflect.__initialize]', () => {
    it('should call the init_ method on the instance', () => {
      let mockService = jasmine.createSpyObj('Service', ['init_']);
      LocationService[Reflect.__initialize](mockService);
      assert(mockService.init_).to.haveBeenCalledWith();
    });
  });

  describe('getParts_', () => {
    it('should split the normalized parts', () => {
      let path = 'path';
      let normalizedPath = '/a/b/c';

      spyOn(service, 'normalizePath_').and.returnValue(normalizedPath);

      assert(service['getParts_'](path)).to.equal(['', 'a', 'b', 'c']);
      assert(service['normalizePath_']).to.haveBeenCalledWith(path);
    });
  });

  describe('init_', () => {
    it('should listen to the hashchange event', () => {
      spyOn(service, 'onHashChange_');

      service['init_']();

      assert(mockWindow.on).to.haveBeenCalledWith(DomEvent.HASHCHANGE, Matchers.any(Function));
      mockWindow.on.calls.argsFor(0)[1]();
      assert(service['onHashChange_']).to.haveBeenCalledWith();
    });
  });

  describe('normalizePath_', () => {
    it('should add missing `/` at the start of the path', () => {
      assert(service['normalizePath_']('path')).to.equal('/path');
    });

    it('should remove extra `/` at the end of the path', () => {
      assert(service['normalizePath_']('/path/')).to.equal('/path');
    });
  });

  describe('onHashChange_', () => {
    it('should dispatch the CHANGED event', () => {
      spyOn(service, 'dispatch');

      service['onHashChange_']();

      assert(service.dispatch).to.haveBeenCalledWith(LocationServiceEvents.CHANGED);
    });
  });

  describe('getMatches', () => {
    it('should return the correct matches', () => {
      let matcher = 'matcher';
      let hash = 'hash';
      spyOn(service, 'getParts_').and.callFake((path: string): string[] | void => {
        switch (path) {
          case matcher:
            return [':a', '_', ':b'];
          case hash:
            return ['hello', '_', 'location'];
        }
      });
      mockLocation.hash = '#' + hash;

      assert(service.getMatches(matcher)).to.equal({
        'a': 'hello',
        'b': 'location',
      });
      assert(service['getParts_']).to.haveBeenCalledWith(hash);
      assert(service['getParts_']).to.haveBeenCalledWith(matcher);
    });

    it('should return null if the matcher does not match the hash', () => {
      let matcher = 'matcher';
      let hash = 'hash';
      spyOn(service, 'getParts_').and.callFake((path: string): string[] | void => {
        switch (path) {
          case matcher:
            return [':a', '_', ':b'];
          case hash:
            return ['hello', '+'];
        }
      });
      mockLocation.hash = '#' + hash;

      assert(service.getMatches(matcher)).to.equal(null);
    });
  });

  describe('goTo', () => {
    it('should set the location with the normalized path', () => {
      let path = 'path';
      let normalizedPath = 'normalizedPath';
      spyOn(service, 'normalizePath_').and.returnValue(normalizedPath);
      service.goTo(path);

      assert(mockLocation.hash).to.equal(normalizedPath);
      assert(service['normalizePath_']).to.haveBeenCalledWith(path);
    });
  });
});
