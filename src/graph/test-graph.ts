import { FLAGS } from '../graph/flags';
import { Graph } from '../graph/graph';
import { NodeId } from '../graph/node-id';
import { StaticId } from '../graph/static-id';

const originalMap = new Map();
let originalCheckValueType: boolean = false;

export const TestGraph = {
  afterEach(): void {
    Graph['nodes_'].clear();
    for (const [key, node] of originalMap) {
      Graph['nodes_'].set(key, node);
    }
    FLAGS.checkValueType = originalCheckValueType;
    Graph['setQueue_'].splice(0, Graph['setQueue_'].length);

    for (const disposable of Graph['disposables_']) {
      disposable.dispose();
    }
  },

  beforeEach(): void {
    originalCheckValueType = FLAGS.checkValueType;
    originalMap.clear();
    for (const [key, node] of Graph['nodes_']) {
      originalMap.set(key, node);
    }
  },

  clear(...nodeIds: NodeId<any>[]): void {
    for (const nodeId of nodeIds) {
      Graph['nodes_'].delete(nodeId);
    }
  },

  init(): void { },

  set<T>(nodeId: NodeId<T>, initValue: T): void {
    FLAGS.checkValueType = false;
    TestGraph.clear(nodeId);
    if (nodeId instanceof StaticId) {
      Graph.createProvider(nodeId, initValue);
    } else {
      Graph.createProvider(nodeId, initValue);
    }
  },
};
