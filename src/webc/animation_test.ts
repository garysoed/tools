import {TestBase} from '../test-base';
TestBase.setup();

import {Animation} from './animation';
import {Mocks} from '../mock/mocks';


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
    fit('should add additional keyframe to the animation', () => {
      let keyframe = Mocks.object('keyframe');
      let newAnimation = Mocks.object('newAnimation');
      spyOn(Animation, 'newInstance').and.returnValue(newAnimation);

      expect(animation.appendKeyframe(keyframe)).toEqual(newAnimation);
      expect(Animation.newInstance).toHaveBeenCalledWith([keyframe], {});
    });
  });

  describe('applyTo', () => {
    fit('should apply the animation to the given element', () => {
      let domAnimate = Mocks.object('domAnimate');
      let mockElement = jasmine.createSpyObj('Element', ['animate']);
      mockElement.animate.and.returnValue(domAnimate);

      expect(animation.applyTo(mockElement)).toEqual(domAnimate);
      expect(mockElement.animate).toHaveBeenCalledWith(keyframes, options);
    });
  });
});
