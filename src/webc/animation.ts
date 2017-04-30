/**
 * Creates an animation object that can be applied to different elements.
 */
export class Animation {
  constructor(
      private keyframes_: AnimationKeyframe[],
      private options_: AnimationOption) { }

  /**
   * Appends a keyframe to the end of animation.
   *
   * @param keyframe The keyframe object to append.
   * @return The new instance of Animation with the appended keyframe.
   */
  appendKeyframe(keyframe: AnimationKeyframe): Animation {
    const newKeyframes = this.keyframes_.slice(0);
    newKeyframes.push(keyframe);
    return Animation.newInstance(newKeyframes, this.options_);
  }

  /**
   * Applies the animation to the given element.
   *
   * @param element Element to apply the animation to.
   * @return The DOM Animation target corresponding to this animation.
   */
  applyTo(element: HTMLElement): EventTarget {
    return element.animate(this.keyframes_, this.options_);
  }

  /**
   * Creates a new instance of Animation.
   *
   * @param keyframes The keyframes to be applied.
   * @param options The options for the animation.
   * @return New instance of Animation object.
   */
  static newInstance(
      keyframes: AnimationKeyframe[],
      options: AnimationOption): Animation {
    return new Animation(keyframes, options);
  }
}
