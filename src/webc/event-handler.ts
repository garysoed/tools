import { Annotations } from '../data/annotations';
import { BaseDisposable } from '../dispose/base-disposable';
import { ListenableDom } from '../event/listenable-dom';
import { MonadUtil } from '../event/monad-util';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Log } from '../util/log';
import { IHandler } from '../webc/interfaces';

const LOGGER = Log.of('gs-tools.webc.EventHandler');

export type EventHandlerConfig = {
  boundArgs: any[],
  event: string,
  handlerKey: string | symbol,
  selector: string | null,
};

export const EVENT_ANNOTATIONS: Annotations<EventHandlerConfig> =
    Annotations.of<EventHandlerConfig>(Symbol('eventHandler'));

export const __listenable = Symbol('listenable');


export class EventHandler implements IHandler<EventHandlerConfig> {
  /**
   * @override
   */
  configure(
      targetEl: Element,
      instance: BaseDisposable,
      configs: ImmutableSet<EventHandlerConfig>): void {
    Log.groupCollapsed(LOGGER, 'Configuring ...');
    const listenable = ListenableDom.of(targetEl);
    instance.addDisposable(listenable);

    for (const {boundArgs, event, handlerKey, selector} of configs) {
      Log.debug(LOGGER, `Handling [${event}] event on [${selector}] with [${handlerKey}]`);
      if (boundArgs.length > 0) {
        Log.warn(LOGGER, `Deprecated use of boundArgs detected`);
        Log.trace(LOGGER);
      }
      instance.addDisposable(listenable.on(
          event,
          () => {
            MonadUtil.callFunction({type: event}, instance, handlerKey);
          },
          instance));
    }
    Log.groupEnd(LOGGER);
  }

  /**
   * Creates a new decorator.
   *
   * @param eventName The name of event to handle.
   * @param selector Selector for the element whose event should be listened to.
   * @return The method decorator. The method should take in the event object.
   */
  createDecorator(eventName: string, selector: string | null, boundArgs: any[]): MethodDecorator {
    return function(
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor): PropertyDescriptor {
      EVENT_ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          {
            boundArgs,
            event: eventName,
            handlerKey: propertyKey,
            selector: selector,
          });
      return descriptor;
    };
  }

  /**
   * @override
   */
  getConfigs(instance: BaseDisposable):
      ImmutableMap<string | symbol, ImmutableSet<EventHandlerConfig>> {
    return EVENT_ANNOTATIONS
        .forCtor(instance.constructor)
        .getAttachedValues();
  }
}
// TODO: Mutable
