import { Annotations } from '../data/annotations';
import { BaseDisposable } from '../dispose/base-disposable';
import { ListenableDom } from '../event/listenable-dom';
import { MonadUtil } from '../event/monad-util';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { ElementSelector } from '../interfaces/selector';
import { Log } from '../util/log';
import { IHandler } from '../webc/interfaces';
import { Util } from '../webc/util';

type AnimateEventHandlerConfig = {
  animationId: symbol,
  event: 'cancel' | 'finish',
  key: string | symbol,
  selector: ElementSelector,
};
type BindConfig = {
  event: 'cancel' | 'finish',
  key: string | symbol,
};

export const __animationHandlerMap: symbol = Symbol('handlerMap');

export const ANNOTATIONS: Annotations<AnimateEventHandlerConfig> =
    Annotations.of<AnimateEventHandlerConfig>(Symbol('animateEventHandler'));

const LOGGER = Log.of('gs-tools.webc.AnimateEventHandler');

export class AnimateEventHandler implements IHandler<AnimateEventHandlerConfig> {
  configure(
      rootEl: HTMLElement,
      _: BaseDisposable,
      configs: ImmutableSet<AnimateEventHandlerConfig>): void {
    Log.groupCollapsed(LOGGER, 'Configuring ...');
    for (const {animationId, event, key, selector} of configs) {
      const targetEl = Util.requireSelector(selector, rootEl);
      const handlers = AnimateEventHandler.getAnimationHandlerList_(targetEl, animationId);
      handlers.push({event, key});
      Log.debug(LOGGER, `Handling animation [${event}] event on [${selector}] with [${key}]`);
    }
    Log.groupEnd(LOGGER);
  }

  createDecorator(
      animationId: symbol,
      event: 'cancel' | 'finish',
      selector: ElementSelector): MethodDecorator {
    return function(
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor): PropertyDescriptor {
      ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          {
            animationId,
            event,
            key: propertyKey,
            selector,
          });
      return descriptor;
    };
  }

  getConfigs(instance: BaseDisposable): ImmutableMap<string | symbol, ImmutableSet<any>> {
    return ANNOTATIONS.forCtor(instance.constructor).getAttachedValues();
  }

  static addAnimation(
      instance: BaseDisposable,
      selector: ElementSelector,
      keyframes: AnimationKeyframe[],
      options: AnimationOption,
      animationId: symbol): void {
    const instanceEl = Util.getElement(instance);
    if (!instanceEl) {
      throw new Error(`No elements found for instance ${instance}`);
    }
    const targetEl = Util.requireSelector(selector, instanceEl);
    const handlers = AnimateEventHandler.getAnimationHandlerList_(targetEl, animationId);
    const animation = targetEl.animate(keyframes, options);
    for (const {event, key} of handlers) {
      const listenableAnimation = ListenableDom.of(animation);
      instance.addDisposable(listenableAnimation);
      instance.addDisposable(listenableAnimation.once(
          event,
          (e: Event) => {
            MonadUtil.callFunction(e, instance, key);
          },
          instance));
    }
  }

  private static getAnimationHandlerList_(
      targetEl: Element,
      animationId: symbol): BindConfig[] {
    const map = AnimateEventHandler.getAnimationHandlerMap_(targetEl);
    const list = map.get(animationId);
    if (list) {
      return list;
    }

    const newList: BindConfig[] = [];
    map.set(animationId, newList);
    return newList;
  }

  private static getAnimationHandlerMap_(targetEl: Element): Map<symbol, BindConfig[]> {
    const map = targetEl[__animationHandlerMap];
    if (map) {
      return map;
    }

    const newMap = new Map<symbol, BindConfig[]>();
    targetEl[__animationHandlerMap] = newMap;
    return newMap;
  }
}
