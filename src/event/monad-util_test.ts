import { assert, TestBase } from '../test-base';
TestBase.setup();

import { MonadUtil } from '../event/monad-util';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Mocks } from '../mock/mocks';


describe('event.MonadUtil', () => {
  describe('callFunction', () => {
    it('should call the function correctly', async () => {
      const value1 = Mocks.object('value1');
      const value2 = Mocks.object('value2');

      const mockMonad1 = jasmine.createSpyObj('Monad1', ['get']);
      mockMonad1.get.and.returnValue(value1);
      const mockMonad2 = jasmine.createSpyObj('Monad2', ['get']);
      mockMonad2.get.and.returnValue(value2);

      const mockFactory1 = jasmine.createSpy('Factory1');
      mockFactory1.and.returnValue(mockMonad1);
      const mockFactory2 = jasmine.createSpy('Factory2');
      mockFactory2.and.returnValue(mockMonad2);

      const monadData = ImmutableSet.of([
        {factory: mockFactory1, index: 0},
        {factory: mockFactory2, index: 2},
      ]);
      const event = Mocks.object('event');
      const eventIndexes = ImmutableSet.of([1, 3]);
      const mockFn = jasmine.createSpy('Fn');
      function fn(arg1: any, arg2: any, arg3: any, arg4: any): any {
        mockFn(this, arg1, arg2, arg3, arg4);
      }

      const context = Mocks.object('context');

      await MonadUtil.callFunction(monadData, eventIndexes, event, fn, context);
      assert(mockFn).to.haveBeenCalledWith(context, value1, event, value2, event);
    });

    it('should update the monads correctly if it is an immutable map', async () => {
      const value = Mocks.object('value');

      const mockMonad = jasmine.createSpyObj('Monad', ['get']);
      mockMonad.get.and.returnValue(value);

      const mockFactory = jasmine.createSpy('Factory');
      mockFactory.and.returnValue(mockMonad);

      const monadData = ImmutableSet.of([
        {factory: mockFactory, index: 0},
      ]);
      const event = Mocks.object('event');
      const eventIndexes = ImmutableSet.of([]);
      const rv = ImmutableMap.of([[mockFactory, 123]]);
      const mockFn = jasmine.createSpy('Fn');
      mockFn.and.returnValue(rv);
      function fn(arg1: any): any {
        return mockFn(this, arg1);
      }

      const context = Mocks.object('context');
      spyOn(MonadUtil, 'updateMonads');

      await MonadUtil.callFunction(monadData, eventIndexes, event, fn, context);
      assert(mockFn).to.haveBeenCalledWith(context, value);
      assert(MonadUtil.updateMonads).to
          .haveBeenCalledWith(ImmutableMap.of([[mockFactory, mockMonad]]), rv);
    });

    it('should update the monads correctly if it is a promise that resolves to immutable map',
        async () => {
      const value = Mocks.object('value');

      const mockMonad = jasmine.createSpyObj('Monad', ['get']);
      mockMonad.get.and.returnValue(value);

      const mockFactory = jasmine.createSpy('Factory');
      mockFactory.and.returnValue(mockMonad);

      const monadData = ImmutableSet.of([
        {factory: mockFactory, index: 0},
      ]);
      const event = Mocks.object('event');
      const eventIndexes = ImmutableSet.of([]);
      const rv = ImmutableMap.of([[mockFactory, 123]]);
      const mockFn = jasmine.createSpy('Fn');
      mockFn.and.returnValue(Promise.resolve(rv));
      function fn(arg1: any): any {
        return mockFn(this, arg1);
      }

      const context = Mocks.object('context');
      spyOn(MonadUtil, 'updateMonads');

      await MonadUtil.callFunction(monadData, eventIndexes, event, fn, context);
      assert(mockFn).to.haveBeenCalledWith(context, value);
      assert(MonadUtil.updateMonads).to
          .haveBeenCalledWith(ImmutableMap.of([[mockFactory, mockMonad]]), rv);
    });

    it('should ignore the return value if it is a promise that resolves to a non immutable map',
        async () => {
      const value = Mocks.object('value');

      const mockMonad = jasmine.createSpyObj('Monad', ['get']);
      mockMonad.get.and.returnValue(value);

      const mockFactory = jasmine.createSpy('Factory');
      mockFactory.and.returnValue(mockMonad);

      const monadData = ImmutableSet.of([
        {factory: mockFactory, index: 0},
      ]);
      const event = Mocks.object('event');
      const eventIndexes = ImmutableSet.of([]);
      const mockFn = jasmine.createSpy('Fn');
      mockFn.and.returnValue(Promise.resolve(Mocks.object('rv')));
      function fn(arg1: any): any {
        return mockFn(this, arg1);
      }

      const context = Mocks.object('context');
      spyOn(MonadUtil, 'updateMonads');

      await MonadUtil.callFunction(monadData, eventIndexes, event, fn, context);
      assert(mockFn).to.haveBeenCalledWith(context, value);
      assert(MonadUtil.updateMonads).toNot.haveBeenCalled();
  });

    it('should throw error if no monad is found for a parameter', async () => {
      const value = Mocks.object('value');

      const mockMonad = jasmine.createSpyObj('Monad', ['get']);
      mockMonad.get.and.returnValue(value);

      const mockFactory = jasmine.createSpy('Factory');
      mockFactory.and.returnValue(mockMonad);

      const monadData = ImmutableSet.of([
        {factory: mockFactory, index: 2},
      ]);
      const event = Mocks.object('event');
      const eventIndexes = ImmutableSet.of([]);
      const mockFn = jasmine.createSpy('Fn');
      mockFn.and.returnValue(Promise.resolve(Mocks.object('rv')));
      function fn(arg1: any): any {
        return mockFn(this, arg1);
      }

      const context = Mocks.object('context');
      spyOn(MonadUtil, 'updateMonads');

      await assert(MonadUtil.callFunction(monadData, eventIndexes, event, fn, context))
          .to.rejectWithError(/No factories/);
    });
  });

  describe('updateMonads', () => {
    it('should update the monads correctly', () => {
      const factory1 = Mocks.object('factory1');
      const mockMonad1 = jasmine.createSpyObj('Monad1', ['set']);
      const factory2 = Mocks.object('factory2');
      const mockMonad2 = jasmine.createSpyObj('Monad2', ['set']);
      const monadMap = ImmutableMap.of([
        [factory1, mockMonad1],
        [factory2, mockMonad2],
      ]);
      const value1 = Mocks.object('value1');
      const value2 = Mocks.object('value2');
      const newValues = ImmutableMap.of([
        [factory1, value1],
        [factory2, value2],
      ]);

      MonadUtil.updateMonads(monadMap, newValues);
      assert(mockMonad1.set).to.haveBeenCalledWith(value1);
      assert(mockMonad2.set).to.haveBeenCalledWith(value2);
    });

    it('should throw error if a monad factory is unrecognized', () => {
      const factory = Mocks.object('factory');
      const mockMonad = jasmine.createSpyObj('Monad', ['set']);
      const unknownFactory = Mocks.object('unknownFactory');
      const monadMap = ImmutableMap.of([
        [factory, mockMonad],
      ]);
      const newValues = ImmutableMap.of([
        [factory, Mocks.object('value1')],
        [unknownFactory, Mocks.object('value2')],
      ]);

      assert(() => {
        MonadUtil.updateMonads(monadMap, newValues);
      }).to.throwError(/No monads found/);
    });
  });
});
