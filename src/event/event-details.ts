import { Annotations } from '../data/annotations';

export const ANNOTATIONS = Annotations.of<number>(Symbol('monad'));

export function eventDetails(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(propertyKey, parameterIndex);
  };
}
