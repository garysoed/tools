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

    const map: Map<string, GraphNode<any>> = target[__NODE_DATA_MAP];
    const fn = descriptor.value || descriptor.get;

    if (map.has(propertyKey)) {
      throw new Error(`Pipe for ${propertyKey} is already registered`);
    }

    if (!(fn instanceof Function)) {
      throw new Error(`${propertyKey} must be a method or a getter`);
    }
    const builder = PipeUtil.initializeNodeBuilder(target, propertyKey);
    builder.fn = fn;

    const graphNode = builder.build();

    if (descriptor.set) {
      descriptor.set = PipeUtil.createSetter(descriptor.set, graphNode);
    }
    map.set(propertyKey, graphNode);
    return descriptor;
  };
}
