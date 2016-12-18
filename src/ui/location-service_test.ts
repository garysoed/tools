import {assert, TestBase} from '../test-base';
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
    mockWindow = Mocks.listenable('window', {location: mockLocation});

    service = new LocationService(mockWindow);
    TestDispose.add(service);
  });

  describe('getParts_', () => {
    it('should split the normalized parts', () => {
      let path = 'path';
      let normalizedPath = '/a/./b/c';

      spyOn(LocationService, 'normalizePath').and.returnValue(normalizedPath);

      assert(service['getParts_'](path)).to.equal(['', 'a', 'b', 'c']);
      assert(LocationService.normalizePath).to.haveBeenCalledWith(path);
    });
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

    it('should return the matches for exact match', () => {
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

      assert(service.getMatches(`${matcher}$`)).to.equal({
        'a': 'hello',
        'b': 'location',
      });
      assert(service['getParts_']).to.haveBeenCalledWith(hash);
      assert(service['getParts_']).to.haveBeenCalledWith(matcher);
    });

    it('should return null for exact match if the number of parts are not the same', () => {
      let matcher = 'matcher';
      let hash = 'hash';
      spyOn(service, 'getParts_').and.callFake((path: string): string[] | void => {
        switch (path) {
          case matcher:
            return [':a', '_', ':b'];
          case hash:
            return [':a', '_'];
        }
      });
      mockLocation.hash = '#' + hash;

      assert(service.getMatches(`${matcher}$`)).to.beNull();
      assert(service['getParts_']).to.haveBeenCalledWith(hash);
      assert(service['getParts_']).to.haveBeenCalledWith(matcher);
    });

  });

  describe('goTo', () => {
    it('should set the location with the normalized path', () => {
      let path = 'path';
      let normalizedPath = 'normalizedPath';
      spyOn(LocationService, 'normalizePath').and.returnValue(normalizedPath);
      service.goTo(path);

      assert(mockLocation.hash).to.equal(normalizedPath);
      assert(LocationService.normalizePath).to.haveBeenCalledWith(path);
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

  describe('normalizePath', () => {
    it('should add missing `/` at the start of the path', () => {
      assert(LocationService.normalizePath('path')).to.equal('/path');
    });

    it('should remove extra `/` at the end of the path', () => {
      assert(LocationService.normalizePath('/path/')).to.equal('/path');
    });
  });
});
