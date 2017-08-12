import { Annotations } from '../data';
import { Monad, MonadFactory } from '../interfaces';

type Data = {factory: MonadFactory<any>, index: number, setter: boolean};
export const ANNOTATIONS = Annotations.of<Data>(Symbol('monad'));

export function monad<T>(factoryOrMonad: MonadFactory<T> | Monad<T>): ParameterDecorator {
  const factory = factoryOrMonad instanceof Function ? factoryOrMonad : () => factoryOrMonad;
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
        propertyKey,
        {factory, index: parameterIndex, setter: false});
  };
}
