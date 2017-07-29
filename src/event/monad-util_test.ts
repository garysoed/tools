import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ANNOTATIONS as EVENT_ANNOTATIONS } from '../event/event-details';
import { ANNOTATIONS as MONAD_ANNOTATIONS } from '../event/monad';
import { MonadUtil } from '../event/monad-util';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Mocks } from '../mock/mocks';


describe('event.MonadUtil', () => {
  describe('callFunction', () => {
    it('should call the function correctly', async () => {
      const key = 'key';
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
        {factory: mockFactory1, id: 'id1', index: 0},
        {factory: mockFactory2, id: 'id2', index: 2},
      ]);
      const event = Mocks.object('event');
      const eventIndexes = ImmutableSet.of([1, 3]);
      spyOn(MonadUtil, 'getMonadData_').and.returnValue({monadData, eventIndexes});

      const mockFn = jasmine.createSpy('Fn');
      function fn(this: any, arg1: any, arg2: any, arg3: any, arg4: any): any {
        mockFn(this, arg1, arg2, arg3, arg4);
      }

      const context = Mocks.object('context');
      context[key] = fn;

      await MonadUtil.callFunction(event, context, key);
      assert(mockFn).to.haveBeenCalledWith(context, value1, event, value2, event);
      assert(MonadUtil['getMonadData_']).to.haveBeenCalledWith(context, key);
    });

    it('should update the monads correctly if it is an immutable map', async () => {
      const key = 'key';
      const value = Mocks.object('value');

      const mockMonad = jasmine.createSpyObj('Monad', ['get']);
      mockMonad.get.and.returnValue(value);

      const mockFactory = jasmine.createSpy('Factory');
      mockFactory.and.returnValue(mockMonad);

      const monadData = ImmutableSet.of([
        {factory: mockFactory, id: 'id', index: 0},
      ]);
      const event = Mocks.object('event');
      const eventIndexes = ImmutableSet.of([]);
      spyOn(MonadUtil, 'getMonadData_').and.returnValue({monadData, eventIndexes});

      const rv = ImmutableSet.of([{id: 123, value: mockFactory}]);
      const mockFn = jasmine.createSpy('Fn');
      mockFn.and.returnValue(rv);
      function fn(this: any, arg1: any): any {
        return mockFn(this, arg1);
      }

      const context = Mocks.object('context');
      context[key] = fn;
      spyOn(MonadUtil, 'updateMonads_');

      await MonadUtil.callFunction(event, context, key);
      assert(mockFn).to.haveBeenCalledWith(context, value);
      assert(MonadUtil['getMonadData_']).to.haveBeenCalledWith(context, key);
      assert(MonadUtil['updateMonads_']).to
          .haveBeenCalledWith(ImmutableMap.of([[mockFactory, mockMonad]]), rv);
    });

    it('should update the monads correctly if it is a promise that resolves to immutable map',
        async () => {
      const key = 'key';
      const value = Mocks.object('value');

      const mockMonad = jasmine.createSpyObj('Monad', ['get']);
      mockMonad.get.and.returnValue(value);

      const mockFactory = jasmine.createSpy('Factory');
      mockFactory.and.returnValue(mockMonad);

      const monadData = ImmutableSet.of([
        {factory: mockFactory, id: 'id', index: 0},
      ]);
      const event = Mocks.object('event');
      const eventIndexes = ImmutableSet.of([]);
      spyOn(MonadUtil, 'getMonadData_').and.returnValue({monadData, eventIndexes});

      const rv = ImmutableSet.of([{id: 123, value: mockFactory}]);
      const mockFn = jasmine.createSpy('Fn');
      mockFn.and.returnValue(Promise.resolve(rv));
      function fn(this: any, arg1: any): any {
        return mockFn(this, arg1);
      }

      const context = Mocks.object('context');
      context[key] = fn;
      spyOn(MonadUtil, 'updateMonads_');

      await MonadUtil.callFunction(event, context, key);
      assert(mockFn).to.haveBeenCalledWith(context, value);
      assert(MonadUtil['getMonadData_']).to.haveBeenCalledWith(context, key);
      assert(MonadUtil['updateMonads_']).to
          .haveBeenCalledWith(ImmutableMap.of([[mockFactory, mockMonad]]), rv);
    });

    it('should ignore the return value if it is a promise that resolves to a non immutable map',
        async () => {
      const key = 'key';
      const value = Mocks.object('value');

      const mockMonad = jasmine.createSpyObj('Monad', ['get']);
      mockMonad.get.and.returnValue(value);

      const mockFactory = jasmine.createSpy('Factory');
      mockFactory.and.returnValue(mockMonad);

      const monadData = ImmutableSet.of([
        {factory: mockFactory, id: 'id', index: 0},
      ]);
      const event = Mocks.object('event');
      const eventIndexes = ImmutableSet.of([]);
      spyOn(MonadUtil, 'getMonadData_').and.returnValue({monadData, eventIndexes});

      const mockFn = jasmine.createSpy('Fn');
      mockFn.and.returnValue(Promise.resolve(Mocks.object('rv')));
      function fn(this: any, arg1: any): any {
        return mockFn(this, arg1);
      }

      const context = Mocks.object('context');
      context[key] = fn;
      spyOn(MonadUtil, 'updateMonads_');

      await MonadUtil.callFunction(event, context, key);
      assert(mockFn).to.haveBeenCalledWith(context, value);
      assert(MonadUtil['getMonadData_']).to.haveBeenCalledWith(context, key);
      assert(MonadUtil['updateMonads_']).toNot.haveBeenCalled();
  });

    it('should throw error if no monad is found for a parameter', async () => {
      const key = 'key';
      const value = Mocks.object('value');

      const mockMonad = jasmine.createSpyObj('Monad', ['get']);
      mockMonad.get.and.returnValue(value);

      const mockFactory = jasmine.createSpy('Factory');
      mockFactory.and.returnValue(mockMonad);

      const monadData = ImmutableSet.of([
        {factory: mockFactory, id: 'id', index: 2},
      ]);
      const event = Mocks.object('event');
      const eventIndexes = ImmutableSet.of([]);
      spyOn(MonadUtil, 'getMonadData_').and.returnValue({monadData, eventIndexes});

      const mockFn = jasmine.createSpy('Fn');
      mockFn.and.returnValue(Promise.resolve(Mocks.object('rv')));
      function fn(this: any, arg1: any): any {
        return mockFn(this, arg1);
      }

      const context = Mocks.object('context');
      context[key] = fn;
      spyOn(MonadUtil, 'updateMonads_');

      await assert(MonadUtil.callFunction(event, context, key))
          .to.rejectWithError(/No factories/);
    });
  });

  describe('getMonadData_', () => {
    class TestClass { }

    it('should return the correct data', () => {
      const instance = new TestClass();
      const key = 'key';

      const expectedMonadData = Mocks.object('expectedMonadData');
      const mockAttachedMonads = jasmine.createSpyObj('AttachedMonads', ['get']);
      mockAttachedMonads.get.and.returnValue(expectedMonadData);
      const mockMonadAnnotations = jasmine.createSpyObj('MonadAnnotations', ['getAttachedValues']);
      mockMonadAnnotations.getAttachedValues.and.returnValue(mockAttachedMonads);
      spyOn(MONAD_ANNOTATIONS, 'forCtor').and.returnValue(mockMonadAnnotations);

      const expectedEventIndexes = Mocks.object('expectedEventIndexes');
      const mockAttachedEvents = jasmine.createSpyObj('AttachedEvents', ['get']);
      mockAttachedEvents.get.and.returnValue(expectedEventIndexes);
      const mockEventAnnotations = jasmine.createSpyObj('EventAnnotations', ['getAttachedValues']);
      mockEventAnnotations.getAttachedValues.and.returnValue(mockAttachedEvents);
      spyOn(EVENT_ANNOTATIONS, 'forCtor').and.returnValue(mockEventAnnotations);

      const {monadData, eventIndexes} = MonadUtil['getMonadData_'](instance, key);
      assert(monadData).to.equal(expectedMonadData);
      assert(eventIndexes).to.equal(expectedEventIndexes);
      assert(mockAttachedEvents.get).to.haveBeenCalledWith(key);
      assert(mockAttachedMonads.get).to.haveBeenCalledWith(key);
      assert(EVENT_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestClass);
      assert(MONAD_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestClass);
    });

    it('should handle empty monad and events', () => {
      const instance = new TestClass();
      const key = 'key';

      const mockAttachedMonads = jasmine.createSpyObj('AttachedMonads', ['get']);
      mockAttachedMonads.get.and.returnValue(undefined);
      const mockMonadAnnotations = jasmine.createSpyObj('MonadAnnotations', ['getAttachedValues']);
      mockMonadAnnotations.getAttachedValues.and.returnValue(mockAttachedMonads);
      spyOn(MONAD_ANNOTATIONS, 'forCtor').and.returnValue(mockMonadAnnotations);

      const mockAttachedEvents = jasmine.createSpyObj('AttachedEvents', ['get']);
      mockAttachedEvents.get.and.returnValue(undefined);
      const mockEventAnnotations = jasmine.createSpyObj('EventAnnotations', ['getAttachedValues']);
      mockEventAnnotations.getAttachedValues.and.returnValue(mockAttachedEvents);
      spyOn(EVENT_ANNOTATIONS, 'forCtor').and.returnValue(mockEventAnnotations);

      const {monadData, eventIndexes} = MonadUtil['getMonadData_'](instance, key);
      assert(monadData).to.equal(ImmutableSet.of([]));
      assert(eventIndexes).to.equal(ImmutableSet.of([]));
      assert(mockAttachedEvents.get).to.haveBeenCalledWith(key);
      assert(mockAttachedMonads.get).to.haveBeenCalledWith(key);
      assert(EVENT_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestClass);
      assert(MONAD_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestClass);
    });
  });

  describe('updateMonads_', () => {
    it('should update the monads correctly', () => {
      const id1 = Mocks.object('id1');
      const mockMonad1 = jasmine.createSpyObj('Monad1', ['set']);
      const id2 = Mocks.object('id2');
      const mockMonad2 = jasmine.createSpyObj('Monad2', ['set']);
      const monadMap = ImmutableMap.of([
        [id1, mockMonad1],
        [id2, mockMonad2],
      ]);
      const value1 = Mocks.object('value1');
      const value2 = Mocks.object('value2');
      const newValues = ImmutableSet.of([
        {id: id1, value: value1},
        {id: id2, value: value2},
      ]);

      MonadUtil['updateMonads_'](monadMap, newValues);
      assert(mockMonad1.set).to.haveBeenCalledWith(value1);
      assert(mockMonad2.set).to.haveBeenCalledWith(value2);
    });

    it('should throw error if a monad factory is unrecognized', () => {
      const id = Mocks.object('id');
      const mockMonad = jasmine.createSpyObj('Monad', ['set']);
      const monadMap = ImmutableMap.of([
        [id, mockMonad],
      ]);
      const newValues = ImmutableSet.of([
        {id: id, value: Mocks.object('value1')},
        {id: 456, value: Mocks.object('value2')},
      ]);

      assert(() => {
        MonadUtil['updateMonads_'](monadMap, newValues);
      }).to.throwError(/No monads found/);
    });
  });
});
