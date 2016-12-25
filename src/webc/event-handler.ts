import {Arrays} from '../collection/arrays';
import {Annotations} from '../data/annotations';
import {BaseDisposable} from '../dispose/base-disposable';
import {ListenableDom} from '../event/listenable-dom';

import {IHandler} from './interfaces';


export type EventHandlerConfig = {
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
  configure(targetEl: Element, instance: BaseDisposable, configs: EventHandlerConfig[]): void {
    let listenable = ListenableDom.of(targetEl);
    instance.addDisposable(listenable);

    Arrays
        .of(configs)
        .forEach((config: EventHandlerConfig) => {
          instance.addDisposable(listenable.on(
              config.event,
              instance[config.handlerKey],
              instance));
        });
  }

  /**
   * Creates a new decorator.
   *
   * @param eventName The name of event to handle.
   * @param selector Selector for the element whose event should be listened to.
   * @return The method decorator. The method should take in the event object.
   */
  createDecorator(eventName: string, selector: string | null): MethodDecorator {
    return function(
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor): PropertyDescriptor {
      EVENT_ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          {
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
  getConfigs(instance: BaseDisposable): Map<string | symbol, EventHandlerConfig> {
    return EVENT_ANNOTATIONS
        .forCtor(instance.constructor)
        .getAttachedValues();
  }
};
