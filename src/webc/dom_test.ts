import { assert, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { AttributeBinder } from './attribute-binder';
import { Dom } from './dom';
import { ElementBinder } from './element-binder';
import { EventDispatcher } from './event-dispatcher';
import { ChildrenElementsBinder } from './immutable-children-elements-binder';
import { InnerTextBinder } from './inner-text-binder';
import { Util } from './util';


describe('webc.Dom', () => {
  let dom: Dom;

  beforeEach(() => {
    dom = new Dom(true /* setter */);
  });

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
      const createMonadSpy = spyOn(dom, 'createMonad_').and.returnValue(monad);

      const binder = Mocks.object('binder');
      spyOn(AttributeBinder, 'of').and.returnValue(binder);

      const target = Mocks.object('target');
      spyOn(Dom, 'requireTargetElement_').and.returnValue(target);

      assert(dom.attribute(config)).to.equal(monad);
      assert(dom['createMonad_']).to.haveBeenCalledWith(Matchers.any(Function) as any);

      const instance = Mocks.object('instance');
      assert(createMonadSpy.calls.argsFor(0)[0](instance)).to.equal(binder);
      assert(AttributeBinder.of).to.haveBeenCalledWith(target, attributeName, parser);
      assert(Dom['requireTargetElement_']).to.haveBeenCalledWith(selector, instance);
    });
  });

  describe('childElements', () => {
    it('should create the monad correctly', () => {
      const bridge = Mocks.object('bridge');
      const startPadCount = 123;
      const endPadCount = 456;
      const selector = 'selector';
      const config = {
        bridge,
        selector,
        startPadCount,
        endPadCount,
      };

      const monad = Mocks.object('monad');
      const createMonadSpy = spyOn(dom, 'createMonad_').and.returnValue(monad);

      const binder = Mocks.object('binder');
      spyOn(ChildrenElementsBinder, 'of').and.returnValue(binder);

      const target = Mocks.object('target');
      spyOn(Dom, 'requireTargetElement_').and.returnValue(target);

      assert(dom.childElements(config)).to.equal(monad);
      assert(dom['createMonad_']).to.haveBeenCalledWith(Matchers.any(Function) as any);

      const instance = Mocks.object('instance');
      assert(createMonadSpy.calls.argsFor(0)[0](instance)).to.equal(binder);
      assert(ChildrenElementsBinder.of).to.haveBeenCalledWith(
          target,
          bridge,
          startPadCount,
          endPadCount,
          instance);
      assert(Dom['requireTargetElement_']).to.haveBeenCalledWith(selector, instance);
    });
  });

  describe('element', () => {
    it('should create the monad correctly', () => {
      const selector = 'selector';

      const monad = Mocks.object('monad');
      const createMonadSpy = spyOn(dom, 'createMonad_').and.returnValue(monad);

      const binder = Mocks.object('binder');
      spyOn(ElementBinder, 'of').and.returnValue(binder);

      const target = Mocks.object('target');
      spyOn(Dom, 'requireTargetElement_').and.returnValue(target);

      assert(dom.element(selector)).to.equal(monad);
      assert(dom['createMonad_']).to.haveBeenCalledWith(Matchers.any(Function) as any);

      const instance = Mocks.object('instance');
      assert(createMonadSpy.calls.argsFor(0)[0](instance)).to.equal(binder);
      assert(ElementBinder.of).to.haveBeenCalledWith(target);
      assert(Dom['requireTargetElement_']).to.haveBeenCalledWith(selector, instance);
    });
  });

  describe('eventDispatcher', () => {
    it('should create the monad correctly', () => {
      const monad = Mocks.object('monad');
      const createMonadSpy = spyOn(dom, 'createMonad_').and.returnValue(monad);

      const dispatcher = Mocks.object('dispatcher');
      spyOn(EventDispatcher, 'of').and.returnValue(dispatcher);

      const target = Mocks.object('target');
      spyOn(Dom, 'requireTargetElement_').and.returnValue(target);

      assert(dom.eventDispatcher()).to.equal(monad);
      assert(dom['createMonad_']).to.haveBeenCalledWith(Matchers.any(Function) as any);

      const instance = Mocks.object('instance');
      assert(createMonadSpy.calls.argsFor(0)[0](instance)).to.equal(dispatcher);
      assert(EventDispatcher.of).to.haveBeenCalledWith(target);
      assert(Dom['requireTargetElement_']).to.haveBeenCalledWith(null, instance);
    });
  });

  describe('innerText', () => {
    it('should create the monad correctly', () => {
      const parser = Mocks.object('parser');
      const selector = 'selector';

      const monad = Mocks.object('monad');
      const createMonadSpy = spyOn(dom, 'createMonad_').and.returnValue(monad);

      const binder = Mocks.object('binder');
      spyOn(InnerTextBinder, 'of').and.returnValue(binder);

      const target = Mocks.object('target');
      spyOn(Dom, 'requireTargetElement_').and.returnValue(target);

      assert(dom.innerText({parser, selector})).to.equal(monad);
      assert(dom['createMonad_']).to.haveBeenCalledWith(Matchers.any(Function) as any);

      const instance = Mocks.object('instance');
      assert(createMonadSpy.calls.argsFor(0)[0](instance)).to.equal(binder);
      assert(InnerTextBinder.of).to.haveBeenCalledWith(target, parser);
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
      spyOn(Util, 'getElement').and.returnValue(root);

      assert(Dom['requireTargetElement_'](selector, instance)).to.equal(target);
      assert(Util.resolveSelector).to.haveBeenCalledWith(selector, root);
      assert(Util.getElement).to.haveBeenCalledWith(instance);
    });

    it('should throw error if the target element cannot be found', () => {
      const selector = 'selector';
      const instance = Mocks.object('instance');
      spyOn(Util, 'resolveSelector').and.returnValue(null);

      const root = Mocks.object('root');
      spyOn(Util, 'getElement').and.returnValue(root);

      assert(() => {
        Dom['requireTargetElement_'](selector, instance);
      }).to.throwError(/Target element not found/);
    });

    it('should throw error if root element cannot be found', () => {
      const selector = 'selector';
      const instance = Mocks.object('instance');
      spyOn(Util, 'getElement').and.returnValue(null);

      assert(() => {
        Dom['requireTargetElement_'](selector, instance);
      }).to.throwError(/Element not found/);
    });
  });
});
