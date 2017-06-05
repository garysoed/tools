import { Annotations } from '../data/annotations';
import { MonadFactory } from '../interfaces/monad-factory';

type Data = {factory: MonadFactory<any>, index: number, setter: boolean};
export const ANNOTATIONS = Annotations.of<Data>(Symbol('monad'));

export function monad<T>(factory: MonadFactory<T>): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
        propertyKey,
        {factory, index: parameterIndex, setter: false});
  };
}
