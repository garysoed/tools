import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { ListenableDom } from '../event/listenable-dom';
import { MonadUtil } from '../event/monad-util';
import { ImmutableSet } from '../immutable/immutable-set';
import { Mocks } from '../mock/mocks';
import {
  __animationHandlerMap,
  AnimateEventHandler,
  ANNOTATIONS } from '../webc/animate-event-handler';
import { Util } from '../webc/util';


describe('webc.AnimateEventHandler', () => {
  let handler: AnimateEventHandler;

  beforeEach(() => {
    handler = new AnimateEventHandler();
  });

  describe('configure', () => {
    it(`should configure correctly`, () => {
      const rootEl = Mocks.object('rootEl');
      const handlers: any[] = [];
      spyOn(AnimateEventHandler, 'getAnimationHandlerList_').and.returnValue(handlers);

      const animationId1 = Symbol('animationId1');
      const event1: 'cancel' = 'cancel';
      const key1 = 'key1';
      const selector1 = 'selector1';
      const config1 = {
        animationId: animationId1,
        event: event1,
        key: key1,
        selector: selector1,
      };
      const animationId2 = Symbol('animationId2');
      const event2: 'finish' = 'finish';
      const key2 = 'key2';
      const selector2 = 'selector2';
      const config2 = {
        animationId: animationId2,
        event: event2,
        key: key2,
        selector: selector2,
      };

      const targetEl = Mocks.object('targetEl');
      spyOn(Util, 'requireSelector').and.returnValue(targetEl);

      handler.configure(rootEl, Mocks.object('disposable'), ImmutableSet.of([config1, config2]));
      assert(handlers).to.equal([{event: event1, key: key1}, {event: event2, key: key2}]);
      assert(AnimateEventHandler['getAnimationHandlerList_']).to
          .haveBeenCalledWith(targetEl, animationId1);
      assert(AnimateEventHandler['getAnimationHandlerList_']).to
          .haveBeenCalledWith(targetEl, animationId2);
      assert(Util.requireSelector).to.haveBeenCalledWith(selector1, rootEl);
      assert(Util.requireSelector).to.haveBeenCalledWith(selector2, rootEl);
    });
  });

  describe('createDecorator', () => {
    it(`should create the decorator correctly`, () => {
      const animationId = Symbol('animationId');
      const event = 'cancel';
      const selector = 'selector';

      const constructor = Mocks.object('constructor');
      const target = Mocks.object('target');
      target.constructor = constructor;

      const propertyKey = 'propertyKey';
      const descriptor = Mocks.object('descriptor');

      const mockAnnotations = jasmine.createSpyObj('Annotations', ['attachValueToProperty']);
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      const decorator = handler.createDecorator(animationId, event, selector);
      assert(decorator(target, propertyKey, descriptor)).to.equal(descriptor);
      assert(mockAnnotations.attachValueToProperty).to.haveBeenCalledWith(
        propertyKey,
        {
          animationId,
          event,
          key: propertyKey,
          selector,
        });
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(constructor);
    });
  });

  describe('getConfigs', () => {
    it(`should return the correct configurations`, () => {
      const constructor = Mocks.object('constructor');
      const instance = Mocks.object('instance');
      instance.constructor = constructor;

      const attachedValues = Mocks.object('attachedValues');
      const mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
      mockAnnotations.getAttachedValues.and.returnValue(attachedValues);
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      assert(handler.getConfigs(instance)).to.equal(attachedValues);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(constructor);
    });
  });

  describe('addAnimation', () => {
    it(`should listen to the event correctly once`, () => {
      const mockInstance = jasmine.createSpyObj('Instance', ['addDisposable']);
      const selector = 'selector';
      const keyframes = Mocks.object('keyframes');
      const options = Mocks.object('options');
      const animationId = Symbol('animationId');

      const disposableFunction1 = Mocks.object('disposableFunction1');
      const mockListenableAnimation1 = jasmine.createSpyObj('ListenableAnimation1', ['once']);
      mockListenableAnimation1.once.and.returnValue(disposableFunction1);

      const disposableFunction2 = Mocks.object('disposableFunction2');
      const mockListenableAnimation2 = jasmine.createSpyObj('ListenableAnimation2', ['once']);
      mockListenableAnimation2.once.and.returnValue(disposableFunction2);

      const event1 = 'finish';
      const event2 = 'cancel';
      const key1 = 'key1';
      const key2 = 'key2';

      const handlers = [
        {event: event1, key: key1},
        {event: event2, key: key2},
      ];
      spyOn(AnimateEventHandler, 'getAnimationHandlerList_').and.returnValue(handlers);


      const animation = Mocks.object('animation');
      const mockTargetEl = jasmine.createSpyObj('TargetEl', ['animate']);
      mockTargetEl.animate.and.returnValue(animation);
      spyOn(Util, 'requireSelector').and.returnValue(mockTargetEl);

      const instanceEl = Mocks.object('instanceEl');
      spyOn(Util, 'getElement').and.returnValue(instanceEl);

      AnimateEventHandler.addAnimation(
          mockInstance,
          selector,
          keyframes,
          options,
          animationId);

      const eventObject = Mocks.object('eventObject');

      assert(mockInstance.addDisposable).to.haveBeenCalledWith(disposableFunction1);
      assert(mockListenableAnimation1.once).to.haveBeenCalledWith(
          event1,
          Matchers.any(Function),
          mockInstance);
      mockListenableAnimation1.once.calls.argsFor(0)[1](eventObject);
      assert(MonadUtil.callFunction).to.haveBeenCalledWith(eventObject, mockInstance, key1);
      assert(mockInstance.addDisposable).to.haveBeenCalledWith(mockListenableAnimation1);

      assert(mockInstance.addDisposable).to.haveBeenCalledWith(disposableFunction2);
      assert(mockListenableAnimation2.once).to.haveBeenCalledWith(
          event2,
          Matchers.any(Function),
          mockInstance);
      mockListenableAnimation2.once.calls.argsFor(0)[1](eventObject);
      assert(MonadUtil.callFunction).to.haveBeenCalledWith(eventObject, mockInstance, key2);
      assert(mockInstance.addDisposable).to.haveBeenCalledWith(mockListenableAnimation2);

      assert(ListenableDom.of).to.haveBeenCalledWith(animation);
      assert(mockTargetEl.animate).to.haveBeenCalledWith(keyframes, options);
      assert(AnimateEventHandler['getAnimationHandlerList_']).to
          .haveBeenCalledWith(mockTargetEl, animationId);
      assert(Util.requireSelector).to.haveBeenCalledWith(selector, instanceEl);
      assert(Util.getElement).to.haveBeenCalledWith(mockInstance);
    });

    it(`should throw error if the instance has no elements`, () => {
      spyOn(Util, 'getElement').and.returnValue(null);

      assert(() => {
        AnimateEventHandler.addAnimation(
            Mocks.object('instance'),
            'selector',
            Mocks.object('keyframes'),
            Mocks.object('options'),
            Symbol('animationId'));
      }).to.throwError(/No elements found/i);
    });
  });

  describe('getAnimationHandlerList_', () => {
    it(`should initialize the list and return it`, () => {
      const targetEl = Mocks.object('targetEl');
      const animationId = Symbol('animationId');
      const map = new Map();
      spyOn(AnimateEventHandler, 'getAnimationHandlerMap_').and.returnValue(map);

      const list = AnimateEventHandler['getAnimationHandlerList_'](targetEl, animationId);
      assert(map.get(animationId)).to.be(list);
      assert(AnimateEventHandler['getAnimationHandlerMap_']).to.haveBeenCalledWith(targetEl);
    });

    it(`should return the existing list`, () => {
      const targetEl = Mocks.object('targetEl');
      const animationId = Symbol('animationId');
      const list = Mocks.object('list');
      const map = new Map();
      map.set(animationId, list);
      spyOn(AnimateEventHandler, 'getAnimationHandlerMap_').and.returnValue(map);

      assert(AnimateEventHandler['getAnimationHandlerList_'](targetEl, animationId)).to.be(list);
    });
  });

  describe('getAnimationHandlerMap', () => {
    it(`should initialize the map and return it`, () => {
      const targetEl = Mocks.object('targetEl');
      const map = AnimateEventHandler['getAnimationHandlerMap_'](targetEl);
      assert(targetEl[__animationHandlerMap]).to.be(map);
    });

    it(`should return the existing map`, () => {
      const targetEl = Mocks.object('targetEl');
      const map = new Map();
      targetEl[__animationHandlerMap] = map;
      assert(AnimateEventHandler['getAnimationHandlerMap_'](targetEl)).to.be(map);
    });
  });
});
