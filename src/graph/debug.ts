import { AssertionError } from '../error';
import { Graph } from '../graph/graph';
import { NodeId } from '../graph/node-id';
import { ImmutableList, ImmutableMap } from '../immutable';

class DebugNode<T> {
  constructor(
      readonly id: NodeId<T>,
      readonly values: ImmutableMap<number, T>,
      readonly parameters: ImmutableList<DebugNode<T>>) { }
}

export const Debug = {
  trace<T>(id: NodeId<T>, context: {}): DebugNode<T> {
    const node = Graph.getNode_(id);
    if (!node) {
      throw AssertionError.condition(`Node for ${id}`, 'to exist', node);
    }

    const valueMap = new Map();
    for (const [time, value] of node.getCache_(context)) {
      valueMap.set(time.value_(), value);
    }

    const parameters = node.getParameterIds()
        .map((id: NodeId<any>) => {
          return Debug.trace(id, context);
        });
    return new DebugNode<T>(id, ImmutableMap.of(valueMap), parameters);
  },
};
