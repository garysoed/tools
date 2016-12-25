import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';

import {Animation} from './animation';


describe('webc.Animation', () => {
  let keyframes;
  let options;
  let animation;

  beforeEach(() => {
    keyframes = [];
    options = {};
    animation = Animation.newInstance(keyframes, options);
  });

  describe('appendKeyframe', () => {
    it('should add additional keyframe to the animation', () => {
      let keyframe = Mocks.object('keyframe');
      let newAnimation = Mocks.object('newAnimation');
      spyOn(Animation, 'newInstance').and.returnValue(newAnimation);

      assert(animation.appendKeyframe(keyframe)).to.equal(newAnimation);
      assert(Animation.newInstance).to.haveBeenCalledWith([keyframe], {});
    });
  });

  describe('applyTo', () => {
    it('should apply the animation to the given element', () => {
      let domAnimate = Mocks.object('domAnimate');
      let mockElement = jasmine.createSpyObj('Element', ['animate']);
      mockElement.animate.and.returnValue(domAnimate);

      assert(animation.applyTo(mockElement)).to.equal(domAnimate);
      assert(mockElement.animate).to.haveBeenCalledWith(keyframes, options);
    });
  });
});
