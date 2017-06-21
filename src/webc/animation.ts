/**
 * Creates an animation object that can be applied to different elements.
 */
import { BaseDisposable } from '../dispose/base-disposable';
import { ListenableDom } from '../event/listenable-dom';
import { ElementSelector } from '../interfaces/selector';
import { EventDispatcher } from '../webc/event-dispatcher';
import { Util } from '../webc/util';

export type AnimationEventDetail = {id: symbol, keyframes: AnimationKeyframe[]};

export class Animation {
  constructor(
      private readonly keyframes_: AnimationKeyframe[],
      private readonly options_: AnimationOption,
      private readonly id_: symbol) { }

  /**
   * Appends a keyframe to the end of animation.
   *
   * @param keyframe The keyframe object to append.
   * @return The new instance of Animation with the appended keyframe.
   */
  appendKeyframe(keyframe: AnimationKeyframe): Animation {
    const newKeyframes = this.keyframes_.slice(0);
    newKeyframes.push(keyframe);
    return Animation.newInstance(newKeyframes, this.options_, this.id_);
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

  start(instance: BaseDisposable, selector: ElementSelector): void {
    const instanceEl = Util.getElement(instance);
    if (!instanceEl) {
      throw new Error(`No elements found for instance [${instance}]`);
    }
    const targetEl = Util.requireSelector(selector, instanceEl);
    const animation = targetEl.animate(this.keyframes_, this.options_);
    const listenableAnimation = ListenableDom.of(animation);
    instance.addDisposable(listenableAnimation);

    const eventDetail = {id: this.id_, keyframes: this.keyframes_};
    instance.addDisposable(listenableAnimation.once(
        'finish',
        () => {
          EventDispatcher.dispatchEvent(targetEl, 'gs-animationfinish', eventDetail);
        },
        this));
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
      options: AnimationOption,
      id: symbol): Animation {
    return new Animation(keyframes, options, id);
  }
}
// TODO: Mutable
