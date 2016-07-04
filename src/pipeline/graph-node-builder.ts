import {ArgMetaData} from './arg-meta-data';
import {GraphNode} from './graph-node';


/**
 * Used for building [GraphNode]s.
 */
export class GraphNodeBuilder<T> {
  argMetaData: ArgMetaData[];
  fn: (...args: any[]) => T;

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
    return GraphNode.newInstance(this.fn, this.argMetaData);
  }
}
