import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Matchers } from '../jasmine/matchers';
import { Mocks } from '../mock/mocks';
import { AttributeBinder } from '../webc/attribute-binder';
import { CustomElementUtil } from '../webc/custom-element-util';
import { Dom } from '../webc/dom';
import { Util } from '../webc/util';


describe('webc.Dom', () => {
  describe('attribute', () => {
    it('should create the monad correctly', () => {
      const attributeName = 'attributeName';
      const parser = Mocks.object('parser');
      const selector = 'selector';
      const config = {
        name: attributeName,
        parser,
        selector,
      };

      const monad = Mocks.object('monad');
      const createMonadSpy = spyOn(Dom, 'createMonad_').and.returnValue(monad);

      const binder = Mocks.object('binder');
      spyOn(AttributeBinder, 'of').and.returnValue(binder);

      const target = Mocks.object('target');
      spyOn(Dom, 'requireTargetElement_').and.returnValue(target);

      assert(Dom.attribute(config)).to.equal(monad);
      assert(Dom['createMonad_']).to.haveBeenCalledWith(Matchers.any(Function) as any, config);

      const instance = Mocks.object('instance');
      assert(createMonadSpy.calls.argsFor(0)[0](instance)).to.equal(binder);
      assert(AttributeBinder.of).to.haveBeenCalledWith(target, attributeName, parser);
      assert(Dom['requireTargetElement_']).to.haveBeenCalledWith(selector, instance);
    });
  });

  describe('requireTargetElement_', () => {
    it('should return the correct element', () => {
      const selector = 'selector';
      const instance = Mocks.object('instance');
      const target = Mocks.object('target');
      spyOn(Util, 'resolveSelector').and.returnValue(target);

      const root = Mocks.object('root');
      spyOn(CustomElementUtil, 'getElement').and.returnValue(root);

      assert(Dom['requireTargetElement_'](selector, instance)).to.equal(target);
      assert(Util.resolveSelector).to.haveBeenCalledWith(selector, root);
      assert(CustomElementUtil.getElement).to.haveBeenCalledWith(instance);
    });

    it('should throw error if the target element cannot be found', () => {
      const selector = 'selector';
      const instance = Mocks.object('instance');
      spyOn(Util, 'resolveSelector').and.returnValue(null);

      const root = Mocks.object('root');
      spyOn(CustomElementUtil, 'getElement').and.returnValue(root);

      assert(() => {
        Dom['requireTargetElement_'](selector, instance);
      }).to.throwError(/Target element not found/);
    });

    it('should throw error if root element cannot be found', () => {
      const selector = 'selector';
      const instance = Mocks.object('instance');
      spyOn(CustomElementUtil, 'getElement').and.returnValue(null);

      assert(() => {
        Dom['requireTargetElement_'](selector, instance);
      }).to.throwError(/Element not found/);
    });
  });
});