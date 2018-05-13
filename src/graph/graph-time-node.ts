import { GNode } from '../graph/g-node';
import { GraphTime } from '../graph/graph-time';
import { ImmutableList } from '../immutable';

export class GraphTimeNode extends GNode<GraphTime> {
  constructor() {
    super(ImmutableList.of([]));
  }

  execute(_context: {} | null, _params: Iterable<any>, timestamp: GraphTime): GraphTime {
    return timestamp;
  }

  execute_(): GraphTime {
    throw new Error('Method not implemented.');
  }
}
