import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { ListenableDom } from '../event/listenable-dom';
import { Mocks } from '../mock/mocks';
import { Animation } from '../webc/animation';
import { EventDispatcher } from '../webc/event-dispatcher';
import { Util } from '../webc/util';


describe('webc.Animation', () => {
  const ID = Symbol('id');
  let keyframes: any[];
  let options: {};
  let animation: Animation;

  beforeEach(() => {
    keyframes = [];
    options = {};
    animation = Animation.newInstance(keyframes, options, ID);
  });

  describe('appendKeyframe', () => {
    it('should add additional keyframe to the animation', () => {
      const keyframe = Mocks.object('keyframe');
      const newAnimation = Mocks.object('newAnimation');
      spyOn(Animation, 'newInstance').and.returnValue(newAnimation);

      assert(animation.appendKeyframe(keyframe)).to.equal(newAnimation);
      assert(Animation.newInstance).to.haveBeenCalledWith([keyframe], {}, ID);
    });
  });

  describe('applyTo', () => {
    it('should apply the animation to the given element', () => {
      const domAnimate = Mocks.object('domAnimate');
      const mockElement = jasmine.createSpyObj('Element', ['animate']);
      mockElement.animate.and.returnValue(domAnimate);

      assert(animation.applyTo(mockElement)).to.equal(domAnimate);
      assert(mockElement.animate).to.haveBeenCalledWith(keyframes, options);
    });
  });

  describe('start', () => {
    it(`should add the animation correctly`, () => {
      const mockInstance = jasmine.createSpyObj('Instance', ['addDisposable']);
      const selector = Mocks.object('selector');

      const instanceElement = Mocks.object('instanceElement');
      const animationEventTarget = Mocks.object('animationEventTarget');
      const mockTargetEl = jasmine.createSpyObj('TargetEl', ['animate']);
      mockTargetEl.animate.and.returnValue(animationEventTarget);

      spyOn(Util, 'requireSelector').and.returnValue(mockTargetEl);
      spyOn(Util, 'getElement').and.returnValue(instanceElement);

      const onceDisposable = Mocks.object('onceDisposable');
      const mockListenableAnimation = jasmine.createSpyObj('ListenableAnimation', ['once']);
      mockListenableAnimation.once.and.returnValue(onceDisposable);
      spyOn(ListenableDom, 'of').and.returnValue(mockListenableAnimation);

      spyOn(EventDispatcher, 'dispatchEventNow');

      animation.start(mockInstance, selector);
      assert(mockInstance.addDisposable).to.haveBeenCalledWith(onceDisposable);
      assert(mockInstance.addDisposable).to.haveBeenCalledWith(mockListenableAnimation);
      assert(mockListenableAnimation.once).to
          .haveBeenCalledWith('finish', Matchers.any(Function), animation);
      mockListenableAnimation.once.calls.argsFor(0)[1]();
      assert(EventDispatcher.dispatchEventNow).to
          .haveBeenCalledWith(mockTargetEl, 'gs-animationfinish', {id: ID, keyframes});

      assert(ListenableDom.of).to.haveBeenCalledWith(animationEventTarget);
      assert(mockTargetEl.animate).to.haveBeenCalledWith(keyframes, options);
      assert(Util.getElement).to.haveBeenCalledWith(mockInstance);
      assert(Util.requireSelector).to.haveBeenCalledWith(selector, instanceElement);
    });

    it(`should throw error if the instance has no element`, () => {
      const instance = Mocks.object('instance');
      const selector = Mocks.object('selector');
      spyOn(Util, 'getElement').and.returnValue(null);

      assert(() => {
        animation.start(instance, selector);
      }).to.throwError(/No elements found/);
    });
  });
});
