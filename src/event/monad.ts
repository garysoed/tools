import { Annotations } from '../data/annotations';
import { MonadFactory } from '../interfaces/monad-factory';

type Data = {factory: MonadFactory<any>, id: any, index: number};
export const ANNOTATIONS = Annotations.of<Data>(Symbol('monad'));

export function monad<T>(factory: MonadFactory<T>, id: any = factory): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
        propertyKey,
        {factory, id, index: parameterIndex});
  };
}
