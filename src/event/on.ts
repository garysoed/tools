import { Annotations } from '../data/annotations';
import { Bus } from '../event/bus';
import { Event } from '../interfaces/event';


type OnConfig<T, E extends Event<T>> = {
  bus: Bus<T, E>,
  type: T,
  useCapture: boolean,
};

export const ON_ANNOTATIONS: Annotations<OnConfig<any, any>> =
    Annotations.of<OnConfig<any, any>>(Symbol('onConfig'));

export function on<T, E extends Event<T>>(
    bus: Bus<T, E>, type: T, useCapture: boolean = false): MethodDecorator {
  return function(
      target: Object,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor): PropertyDescriptor {
    ON_ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
        propertyKey,
        {bus, type, useCapture});
    return descriptor;
  };
}
