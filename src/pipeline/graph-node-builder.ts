import { ArgMetaData } from './arg-meta-data';
import { GraphNode } from './graph-node';


/**
 * Used for building [GraphNode]s.
 */
export class GraphNodeBuilder<T> {
  argMetaData: ArgMetaData[];
  fn: (((...args: any[]) => T)|null);

  constructor() {
    this.argMetaData = [];
    this.fn = null;
  }

  /**
   * Builds the graph node.
   *
   * @return The graph node.
   */
  build(): GraphNode<T> {
    if (this.fn === null) {
      throw new Error('Required function does not exist');
    }
    return GraphNode.newInstance(this.fn, this.argMetaData);
  }
}
