import {ArgMetaData} from './arg-meta-data';
import {GraphNode} from './graph-node';
import {GraphNodeBuilder} from './graph-node-builder';


export const __NODE_BUILDER_DATA_MAP = Symbol('nodeBuilderDataMap');
export const __NODE_DATA_MAP = Symbol('nodeDataMap');

/**
 * Various utilities for working with [Pipe].
 */
export const PipeUtil = {
  /**
   * Adds an argument for the given node.
   *
   * @param target The context of the pipe to add the argument to.
   * @param propertyKey The name of the property of the pipe to add the argument to.
   * @param parameterIndex The added argument's index.
   * @param argMetaData The argument metadata to add.
   */
  addArgument(
      target: Object,
      propertyKey: string | symbol,
      parameterIndex: number,
      argMetaData: ArgMetaData): void {
    let builder = PipeUtil.initializeNodeBuilder(target, propertyKey);
    builder.argMetaData[parameterIndex] = argMetaData;
  },

  /**
   * Creates a setter to replace the node setter.
   *
   * @param descriptor Descriptor of the property corresponding to the node.
   * @param graphNode The graph node corresponding to the setter.
   */
  createSetter<T>(
      setter: (v: any) => void,
      graphNode: GraphNode<T>): (value: T) => void {
    return function(value: T): void {
      graphNode.clearCache(this, []);
      setter.call(this, value);
    };
  },

  /**
   * Returns the node corresponding to the given property.
   *
   * @param context The context of the node to be returned.
   * @param key The property name corresponding to the node to be returned.
   * @return The node corresponding to the given property, or null if none exists.
   */
  getNode<T>(context: any, key: string | symbol): (GraphNode<T>|null) {
    let nodeMap: Map<string | symbol, GraphNode<any>> = context[__NODE_DATA_MAP];

    return nodeMap ?
        nodeMap.get(key) || null :
        null;
  },

  /**
   * Initielizes the node builder for the given property.
   *
   * @param context The context of the node whose node builder should be initialized.
   * @param key The property name corresponding to the node builder.
   * @return The node building corresponding to the given property.
   */
  initializeNodeBuilder(
      context: any,
      key: string | symbol): GraphNodeBuilder<any> {
    if (!context[__NODE_BUILDER_DATA_MAP]) {
      context[__NODE_BUILDER_DATA_MAP] = new Map<string | symbol, GraphNodeBuilder<any>>();
    }

    let builderMap: Map<string | symbol, GraphNodeBuilder<any>> = context[__NODE_BUILDER_DATA_MAP];

    if (!builderMap.has(key)) {
      builderMap.set(key, new GraphNodeBuilder<any>());
    }
    return builderMap.get(key)!;
  },
};
