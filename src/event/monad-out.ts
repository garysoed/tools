import { ANNOTATIONS } from '../event/monad';
import { MonadFactory } from '../interfaces/monad-factory';

export function monadOut<T>(factory: MonadFactory<T>): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
        propertyKey,
        {factory, index: parameterIndex, setter: true});
  };
}
