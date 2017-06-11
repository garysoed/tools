import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';

import { Animation } from './animation';


describe('webc.Animation', () => {
  let keyframes: any[];
  let options: {};
  let animation: Animation;

  beforeEach(() => {
    keyframes = [];
    options = {};
    animation = Animation.newInstance(keyframes, options);
  });

  describe('appendKeyframe', () => {
    it('should add additional keyframe to the animation', () => {
      const keyframe = Mocks.object('keyframe');
      const newAnimation = Mocks.object('newAnimation');
      spyOn(Animation, 'newInstance').and.returnValue(newAnimation);

      assert(animation.appendKeyframe(keyframe)).to.equal(newAnimation);
      assert(Animation.newInstance).to.haveBeenCalledWith([keyframe], {});
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
});
