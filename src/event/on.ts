import { Annotations } from '../data/annotations';
import { Bus } from '../event/bus';
import { MonadUtil } from '../event/monad-util';
import { Event } from '../interfaces/event';

type BusProvider<T, E extends Event<T>> = (instance: any) => Bus<T, E>;
type OnConfig<T, E extends Event<T>> = {
  busProvider: BusProvider<T, E>,
  handler: (event: Event<T>, instance: {}) => void,
  type: T,
  useCapture: boolean,
};

export const ON_ANNOTATIONS: Annotations<OnConfig<any, any>> =
    Annotations.of<OnConfig<any, any>>(Symbol('onConfig'));

export function on<T, E extends Event<T>>(
    bus: Bus<T, E> | BusProvider<T, E>, type: T, useCapture: boolean = false): MethodDecorator {
  return function(
      target: Object,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor): PropertyDescriptor {
    const busProvider = bus instanceof Bus ? () => bus : bus;
    ON_ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
        propertyKey,
        {
          busProvider,
          handler(event: Event<any>, instance: {}): void {
            MonadUtil.callFunction(event, instance, propertyKey);
          },
          type,
          useCapture,
        });
    return descriptor;
  };
}
