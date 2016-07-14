import TestBase from '../test-base';
TestBase.setup();

import Cache from '../data/a-cache';
import FakeScope from './fake-scope';
import {Mocks} from '../mock/mocks';
import {RouteService} from './route-service';
import {TestDispose} from '../testing/test-dispose';

describe('ng.RouteService', () => {
  let mock$location;
  let mock$scope;
  let mock$scope$onSpy;
  let service;

  beforeEach(() => {
    mock$location = jasmine.createSpyObj('$location', ['path', 'search']);
    mock$scope = FakeScope.create();

    mock$scope$onSpy = spyOn(mock$scope, '$on').and.callThrough();

    service = new RouteService(mock$location, mock$scope);
    TestDispose.add(service);
  });

  it('should clear the cache when route change success event is received', () => {
    spyOn(Cache, 'clear');

    expect(mock$scope.$on).toHaveBeenCalledWith('$routeChangeSuccess', jasmine.any(Function));

    mock$scope$onSpy.calls.argsFor(0)[1]();
    expect(Cache.clear).toHaveBeenCalledWith(service);
  });

  describe('get params', () => {
    it('should return params in the memory and in URL', () => {
      let memoryParams = { 'a': 1 };
      let searchObject = Mocks.object('search');
      mock$location.search.and.returnValue({ 'b': JSON.stringify(searchObject) });
      service.to('path', {}, memoryParams);

      expect(service.params).toEqual({
        'a': 1,
        'b': searchObject,
      });
    });

    it('should override the param in memory with param in URL', () => {
      let searchObject = Mocks.object('search');
      let memoryObject = Mocks.object('memory');
      let memoryParams = { 'a': memoryObject };

      mock$location.search.and.returnValue({ 'a': JSON.stringify(searchObject) });
      service.to('path', {}, memoryParams);

      expect(service.params).toEqual({ 'a': searchObject });

    });
  });

  describe('get path', () => {
    it('should return the path', () => {
      let path = 'path';
      mock$location.path.and.returnValue(path);
      expect(service.path).toEqual(path);
      expect(mock$location.path).toHaveBeenCalledWith();
    });
  });

  describe('to', () => {
    it('should set the correct path, search param, and memory params', () => {
      let objectA = Mocks.object('a');
      let objectB = Mocks.object('b');
      let objectNewOverridden = Mocks.object('new overridden');
      let path = 'path';
      let memoryParams = {
        'a': objectA,
        'overridden': Mocks.object('overridden'),
      };
      let searchParams = {
        'b': objectB,
        'overridden': objectNewOverridden,
      };

      service.to(path, searchParams, memoryParams);

      expect(mock$location.path).toHaveBeenCalledWith(path);
      expect(mock$location.search).toHaveBeenCalledWith({
        'b': JSON.stringify(objectB),
        'overridden': JSON.stringify(objectNewOverridden),
      });
      expect(service['tempParams_']).toEqual({
        'a': objectA,
        'b': objectB,
        'overridden': objectNewOverridden,
      });
    });
  });
});
