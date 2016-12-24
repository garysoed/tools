import {assert, Matchers, TestBase} from 'src/test-base';
TestBase.setup();

import Cache from 'src/data/a-cache';
import {Mocks} from 'src/mock/mocks';
import {TestDispose} from 'src/testing/test-dispose';

import FakeScope from './fake-scope';
import {RouteService} from './route-service';

describe('ng.RouteService', () => {
  let mock$location;
  let mock$scope;
  let mock$scope$onSpy;
  let service: RouteService;

  beforeEach(() => {
    mock$location = jasmine.createSpyObj('$location', ['path', 'search']);
    mock$scope = FakeScope.create();

    mock$scope$onSpy = spyOn(mock$scope, '$on').and.callThrough();

    service = new RouteService(mock$location, mock$scope);
    TestDispose.add(service);
  });

  it('should clear the cache when route change success event is received', () => {
    spyOn(Cache, 'clear');

    assert(mock$scope.$on).to.haveBeenCalledWith('$routeChangeSuccess', Matchers.any(Function));

    mock$scope$onSpy.calls.argsFor(0)[1]();
    assert(Cache.clear).to.haveBeenCalledWith(service);
  });

  describe('get params', () => {
    it('should return params in the memory and in URL', () => {
      let memoryParams = { 'a': 1 };
      let searchObject = Mocks.object('search');
      mock$location.search.and.returnValue({ 'b': JSON.stringify(searchObject) });
      service.to('path', {}, memoryParams);

      assert(service.getParams()).to.equal({
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

      assert(service.getParams()).to.equal({ 'a': searchObject });

    });
  });

  describe('get path', () => {
    it('should return the path', () => {
      let path = 'path';
      mock$location.path.and.returnValue(path);
      assert(service.getPath()).to.equal(path);
      assert(mock$location.path).to.haveBeenCalledWith();
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

      assert(mock$location.path).to.haveBeenCalledWith(path);
      assert(mock$location.search).to.haveBeenCalledWith({
        'b': JSON.stringify(objectB),
        'overridden': JSON.stringify(objectNewOverridden),
      });
      assert(service['tempParams_']).to.equal({
        'a': objectA,
        'b': objectB,
        'overridden': objectNewOverridden,
      });
    });
  });
});
