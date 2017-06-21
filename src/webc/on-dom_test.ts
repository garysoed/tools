import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Fakes } from '../mock/fakes';
import { Mocks } from '../mock/mocks';
import {
  ATTRIBUTE_CHANGE_HANDLER,
  CHILD_LIST_CHANGE_HANDLER,
  EVENT_HANDLER,
  onDom} from '../webc/on-dom';
import { Util } from '../webc/util';


describe('webc.onDom', () => {
  describe('attributeChange', () => {
    it('should return the correct decorator', () => {
      const name = 'name';
      const parser = Mocks.object('parser');
      const selector = 'selector';
      const decorator = Mocks.object('decorator');
      spyOn(ATTRIBUTE_CHANGE_HANDLER, 'createDecorator').and.returnValue(decorator);

      assert(onDom.attributeChange({name, parser, selector})).to.equal(decorator);
      assert(ATTRIBUTE_CHANGE_HANDLER.createDecorator).to
          .haveBeenCalledWith(name, parser, selector);
    });
  });

  describe('childListChange', () => {
    it('should return the correct decorator', () => {
      const selector = 'selector';
      const decorator = Mocks.object('decorator');
      spyOn(CHILD_LIST_CHANGE_HANDLER, 'createDecorator').and.returnValue(decorator);

      assert(onDom.childListChange(selector)).to.equal(decorator);
      assert(CHILD_LIST_CHANGE_HANDLER.createDecorator).to.haveBeenCalledWith(selector);
    });
  });

  describe('event', () => {
    it('should return the correct decorator', () => {
      const name = 'name';
      const selector = 'selector';
      const decorator = Mocks.object('decorator');
      spyOn(EVENT_HANDLER, 'createDecorator').and.returnValue(decorator);

      assert(onDom.event(selector, name)).to.equal(decorator);
      assert(EVENT_HANDLER.createDecorator).to.haveBeenCalledWith(name, selector, []);
    });
  });

  describe('configure', () => {
    it('should configure the handlers correctly', () => {
      const element = Mocks.object('element');
      element.nodeName = 'element';
      const instance = Mocks.object('instance');
      spyOn(onDom, 'configure_').and.returnValue(new Set());

      onDom.configure(element, instance);

      assert(onDom['configure_']).to
          .haveBeenCalledWith(element, instance, ATTRIBUTE_CHANGE_HANDLER);
      assert(onDom['configure_']).to
          .haveBeenCalledWith(element, instance, EVENT_HANDLER);
    });

    it('should throw error if there are unresolved electors', () => {
      const selector = 'selector';
      const element = Mocks.object('element');
      element.nodeName = 'element';
      const instance = Mocks.object('instance');
      spyOn(onDom, 'configure_').and.returnValue(new Set(selector));

      assert(() => {
        onDom.configure(element, instance);
      }).to.throwError(new RegExp(selector));
    });
  });

  describe('configure_', () => {
    it('should configure the element and handler correctly', () => {
      const parentElement = Mocks.object('parentElement');
      const instance = Mocks.object('instance');
      const mockHandler = jasmine.createSpyObj('Handler', ['configure', 'getConfigs']);

      const selector1_1 = Mocks.object('selector1_1');
      const configs1_1 = Mocks.object('configs1_1');
      configs1_1.selector = selector1_1;

      const selector1_2 = Mocks.object('selector1_2');
      const configs1_2 = Mocks.object('configs1_2');
      configs1_2.selector = selector1_2;

      const selector2_1 = Mocks.object('selector2_1');
      const configs2_1 = Mocks.object('configs2_1');
      configs2_1.selector = selector2_1;

      const selector2_2 = Mocks.object('selector2_2');
      const configs2_2 = Mocks.object('configs2_2');
      configs2_2.selector = selector2_2;

      const map = ImmutableMap.of([
        ['propertyKey1', ImmutableSet.of([configs1_1, configs1_2])],
        ['propertyKey2', ImmutableSet.of([configs2_1, configs2_2])],
      ]);
      mockHandler.getConfigs.and.returnValue(map);

      const targetEl1 = Mocks.object('targetEl1');
      const targetEl2 = Mocks.object('targetEl2');

      Fakes.build(spyOn(Util, 'resolveSelector'))
          .when(selector1_1).return(targetEl1)
          .when(selector1_2).return(targetEl1)
          .when(selector2_1).return(targetEl2)
          .when(selector2_2).return(targetEl2);

      onDom['configure_'](parentElement, instance, mockHandler);

      assert(mockHandler.configure).to
          .haveBeenCalledWith(targetEl1, instance, ImmutableSet.of([configs1_1, configs1_2]));
      assert(mockHandler.configure).to
          .haveBeenCalledWith(targetEl2, instance, ImmutableSet.of([configs2_1, configs2_2]));

      assert(Util.resolveSelector).to.haveBeenCalledWith(selector1_1, parentElement);
      assert(Util.resolveSelector).to.haveBeenCalledWith(selector1_2, parentElement);
      assert(Util.resolveSelector).to.haveBeenCalledWith(selector2_1, parentElement);
      assert(Util.resolveSelector).to.haveBeenCalledWith(selector2_2, parentElement);

      assert(mockHandler.getConfigs).to.haveBeenCalledWith(instance);
    });

    it('should return the unresolved selectors', () => {
      const parentElement = Mocks.object('parentElement');
      const instance = Mocks.object('instance');
      const mockHandler = jasmine.createSpyObj('Handler', ['configure', 'getConfigs']);

      const selector = Mocks.object('selector');
      const configs = Mocks.object('configs');
      configs.selector = selector;

      const map = ImmutableMap.of([['propertyKey', ImmutableSet.of([configs])]]);
      mockHandler.getConfigs.and.returnValue(map);

      spyOn(Util, 'resolveSelector').and.returnValue(null);

      assert(onDom['configure_'](parentElement, instance, mockHandler))
          .to.haveElements([selector]);

      assert(mockHandler.configure).toNot.haveBeenCalled();
      assert(Util.resolveSelector).to.haveBeenCalledWith(selector, parentElement);
      assert(mockHandler.getConfigs).to.haveBeenCalledWith(instance);
    });
  });
});
