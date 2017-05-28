import { Annotations } from '../data/annotations';
import { MonadFactory } from '../interfaces/monad-factory';

export const ANNOTATIONS = Annotations.of<number>(Symbol('monad'));

export function event<T>(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(propertyKey, parameterIndex);
  };
}
