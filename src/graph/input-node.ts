import { GLOBALS, GNode } from '../graph/g-node';
import { GraphTime } from '../graph/graph-time';
import { ImmutableList } from '../immutable';

export class InputNode<T> extends GNode<T> {
  private readonly symbol_: symbol = Symbol('inputNode');

  constructor() {
    super(ImmutableList.of([]));
  }

  protected execute_(context: {}): T {
    return context[this.symbol_];
  }

  set(context: {} | null, timestamp: GraphTime, value: T): void {
    const normalizedContext = context || GLOBALS;
    this.set_(normalizedContext, value);
    this.addToCache_(normalizedContext, timestamp, value);
  }

  private set_(context: {}, value: T): void {
    context[this.symbol_] = value;
  }
}
