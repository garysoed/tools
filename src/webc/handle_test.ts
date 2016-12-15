import {assert, TestBase} from '../test-base';
TestBase.setup();

import {ATTRIBUTE_CHANGE_HANDLER, EVENT_HANDLER, Handler} from './handle';
import {Mocks} from '../mock/mocks';
import {Util} from './util';


describe('webc.Handler', () => {
  const SELECTOR = 'SELECTOR';
  let handler: Handler;

  beforeEach(() => {
    handler = new Handler(SELECTOR);
  });

  describe('configure', () => {
    it('should configure the handlers correctly', () => {
      let element = Mocks.object('element');
      let instance = Mocks.object('instance');
      spyOn(Handler, 'configure_').and.returnValue(new Set());

      Handler.configure(element, instance);

      assert(Handler['configure_']).to
          .haveBeenCalledWith(element, instance, ATTRIBUTE_CHANGE_HANDLER);
      assert(Handler['configure_']).to
          .haveBeenCalledWith(element, instance, EVENT_HANDLER);
    });

    it('should throw error if there are unresolved electors', () => {
      let selector = 'selector';
      let element = Mocks.object('element');
      let instance = Mocks.object('instance');
      spyOn(Handler, 'configure_').and.returnValue(new Set(selector));

      assert(() => {
        Handler.configure(element, instance);
      }).to.throwError(new RegExp(selector));
    });
  });

  describe('configure_', () => {
    it('should configure the element and handler correctly', () => {
      let parentElement = Mocks.object('parentElement');
      let instance = Mocks.object('instance');
      let mockHandler = jasmine.createSpyObj('Handler', ['configure', 'getConfigs']);

      let selector1_1 = Mocks.object('selector1_1');
      let configs1_1 = Mocks.object('configs1_1');
      configs1_1.selector = selector1_1;

      let selector1_2 = Mocks.object('selector1_2');
      let configs1_2 = Mocks.object('configs1_2');
      configs1_2.selector = selector1_2;

      let selector2_1 = Mocks.object('selector2_1');
      let configs2_1 = Mocks.object('configs2_1');
      configs2_1.selector = selector2_1;

      let selector2_2 = Mocks.object('selector2_2');
      let configs2_2 = Mocks.object('configs2_2');
      configs2_2.selector = selector2_2;

      let map = new Map();
      map.set('propertyKey1_1', configs1_1);
      map.set('propertyKey1_2', configs1_2);
      map.set('propertyKey2_1', configs2_1);
      map.set('propertyKey2_2', configs2_2);
      mockHandler.getConfigs.and.returnValue(map);

      let targetEl1 = Mocks.object('targetEl1');
      let targetEl2 = Mocks.object('targetEl2');

      spyOn(Util, 'resolveSelector').and.callFake((config: any) => {
        switch (config) {
          case selector1_1:
          case selector1_2:
            return targetEl1;
          case selector2_1:
          case selector2_2:
            return targetEl2;
        }
      });

      Handler['configure_'](parentElement, instance, mockHandler);

      assert(mockHandler.configure).to
          .haveBeenCalledWith(targetEl1, instance, [configs1_1, configs1_2]);
      assert(mockHandler.configure).to
          .haveBeenCalledWith(targetEl2, instance, [configs2_1, configs2_2]);

      assert(Util.resolveSelector).to.haveBeenCalledWith(selector1_1, parentElement);
      assert(Util.resolveSelector).to.haveBeenCalledWith(selector1_2, parentElement);
      assert(Util.resolveSelector).to.haveBeenCalledWith(selector2_1, parentElement);
      assert(Util.resolveSelector).to.haveBeenCalledWith(selector2_2, parentElement);

      assert(mockHandler.getConfigs).to.haveBeenCalledWith(instance);
    });

    it('should return the unresolved selectors', () => {
      let parentElement = Mocks.object('parentElement');
      let instance = Mocks.object('instance');
      let mockHandler = jasmine.createSpyObj('Handler', ['configure', 'getConfigs']);

      let selector = Mocks.object('selector');
      let configs = Mocks.object('configs');
      configs.selector = selector;

      let map = new Map();
      map.set('propertyKey', configs);
      mockHandler.getConfigs.and.returnValue(map);

      spyOn(Util, 'resolveSelector').and.returnValue(null);

      assert(Handler['configure_'](parentElement, instance, mockHandler))
          .to.haveElements([selector]);

      assert(mockHandler.configure).toNot.haveBeenCalled();
      assert(Util.resolveSelector).to.haveBeenCalledWith(selector, parentElement);
      assert(mockHandler.getConfigs).to.haveBeenCalledWith(instance);
    });
  });
});
