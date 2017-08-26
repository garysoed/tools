import { Annotations } from '../data';
import { NodeId } from '../graph/node-id';

type Data = {id: NodeId<any>, index: number};
export const ANNOTATIONS: Annotations<Data> = Annotations.of<Data>(Symbol('nodeIn'));

export function nodeIn(id: NodeId<any>): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, index: number) => {
    ANNOTATIONS.forCtor(target.constructor)
        .attachValueToProperty(propertyKey, {index, id});
  };
}
