import { ANNOTATIONS } from '../event/monad';
import { Monad, MonadFactory } from '../interfaces';

export function monadOut<T>(factoryOrMonad: MonadFactory<T> | Monad<T>): ParameterDecorator {
  const factory = factoryOrMonad instanceof Function ? factoryOrMonad : () => factoryOrMonad;
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
        propertyKey,
        {factory, index: parameterIndex, setter: true});
  };
}
