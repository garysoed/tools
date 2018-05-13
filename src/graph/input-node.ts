import { GLOBALS, GNode } from '../graph/g-node';
import { GraphTime } from '../graph/graph-time';
import { ImmutableList } from '../immutable';

export class InputNode<T> extends GNode<T> {
  private readonly symbol_: symbol = Symbol('inputNode');

  constructor(private readonly initValue_: T) {
    super(ImmutableList.of([]));
  }

  execute_(context: {}): T {
    const value = context[this.symbol_];
    return value === undefined ? this.initValue_ : value;
  }

  set(context: {} | null, timestamp: GraphTime, value: T): void {
    const normalizedContext = context || GLOBALS;
    this.set_(normalizedContext, value);
    this.addToCache_(normalizedContext, timestamp, value);
  }

  set_(context: {}, value: T): void {
    context[this.symbol_] = value;
  }
}
