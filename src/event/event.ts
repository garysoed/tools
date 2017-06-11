import { Annotations } from '../data/annotations';

export const ANNOTATIONS = Annotations.of<number>(Symbol('monad'));

export function event(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(propertyKey, parameterIndex);
  };
}
