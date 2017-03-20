import { Validate } from '../valid/validate';

import { GraphNode } from './graph-node';
import { __NODE_DATA_MAP, PipeUtil } from './pipe-util';


/**
 * Annotates a method indicating that it is a graph node.
 */
export function Pipe(): MethodDecorator {
  return (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor): TypedPropertyDescriptor<any> => {
    if (!target[__NODE_DATA_MAP]) {
      target[__NODE_DATA_MAP] = new Map<string, GraphNode<any>>();
    }

    let map: Map<string, GraphNode<any>> = target[__NODE_DATA_MAP];
    let fn = descriptor.value || descriptor.get;

    Validate
        .batch({
          'propertyKey': Validate.map(map)
              .toNot.containKey(propertyKey)
              .orThrows(`Pipe for ${propertyKey} is already registered`),
          'type': Validate.any(fn)
              .to.exist()
              .orThrows(`${propertyKey} must be a method or a getter`),
        })
        .to.allBeValid()
        .assertValid();
    let builder = PipeUtil.initializeNodeBuilder(target, propertyKey);
    builder.fn = fn;

    let graphNode = builder.build();

    if (descriptor.set) {
      descriptor.set = PipeUtil.createSetter(descriptor.set, graphNode);
    }
    map.set(propertyKey, graphNode);
    return descriptor;
  };
};

