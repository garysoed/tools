import { assert, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { MonadUtil } from '../event/monad-util';
import { ImmutableSet } from '../immutable/immutable-set';
import { DimensionObserver } from '../ui/dimension-observer';
import {
  DIMENSION_CHANGE_ANNOTATIONS,
  DimensionChangeHandler } from '../webc/dimension-change-handler';


describe('webc.DimensionChangeHandler', () => {
  let handler: DimensionChangeHandler;

  beforeEach(() => {
    handler = new DimensionChangeHandler();
  });

  describe('configure', () => {
    it(`should configure correctly`, () => {
      const targetEl = Mocks.object('targetEl');
      const instance = Mocks.object('instance');

      const key1 = 'key1';
      const key2 = 'key2';
      const configs = ImmutableSet.of([
        {handlerKey: key1} as any,
        {handlerKey: key2} as any,
      ]);

      const mockObserver = jasmine.createSpyObj('Observer', ['observe']);
      const observerOfSpy = spyOn(DimensionObserver, 'of').and.returnValue(mockObserver);

      const dimensionChangedSpy = spyOn(handler, 'onDimensionChanged_');

      handler.configure(targetEl, instance, configs);
      assert(mockObserver.observe).to.haveBeenCalledWith(targetEl);

      assert(DimensionObserver.of).to.haveBeenCalledWith(Matchers.anyFunction(), handler);
      const clientRect = Mocks.object('clientRect');
      observerOfSpy.calls.argsFor(0)[0](clientRect);
      assert(handler['onDimensionChanged_'] as any).to
          .haveBeenCalledWith(instance, Matchers.any(ImmutableSet), clientRect);
      assert(dimensionChangedSpy.calls.argsFor(0)[1] as ImmutableSet<any>)
          .to.haveElements([key1, key2]);
    });
  });

  describe('createDecorator', () => {
    it(`should return the correct decorator`, () => {
      class TestClass { }
      const selector = 'selector';
      const propertyKey = 'propertyKey';
      const descriptor = Mocks.object('descriptor');
      const decorator = handler.createDecorator(selector);
      const mockAnnotations = jasmine.createSpyObj('Annotations', ['attachValueToProperty']);
      spyOn(DIMENSION_CHANGE_ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      assert(decorator(TestClass, propertyKey, descriptor)).to.equal(descriptor);
      assert(mockAnnotations.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          {handlerKey: propertyKey, selector});
      assert(DIMENSION_CHANGE_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestClass.constructor);
    });
  });

  describe('getConfigs', () => {
    it(`should return the correct configs`, () => {
      const constructor = Mocks.object('constructor');
      const instance = Mocks.object('instance');
      instance.constructor = constructor;
      const configs = Mocks.object('configs');
      const mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
      mockAnnotations.getAttachedValues.and.returnValue(configs);
      spyOn(DIMENSION_CHANGE_ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      assert(handler.getConfigs(instance)).to.equal(configs);
      assert(DIMENSION_CHANGE_ANNOTATIONS.forCtor).to.haveBeenCalledWith(constructor);
    });
  });

  describe('onDimensionChanged_', () => {
    it(`should call the handlers correctly`, () => {
      const instance = Mocks.object('instance');
      const key1 = 'key1';
      const key2 = 'key2';
      const clientRect = Mocks.object('clientRect');
      spyOn(MonadUtil, 'callFunction');

      handler['onDimensionChanged_'](instance, [key1, key2], clientRect);
      assert(MonadUtil.callFunction).to.haveBeenCalledWith(
          {clientRect, type: 'gs-dimensionchange'},
          instance,
          key1);
      assert(MonadUtil.callFunction).to.haveBeenCalledWith(
          {clientRect, type: 'gs-dimensionchange'},
          instance,
          key2);
    });
  });
});
