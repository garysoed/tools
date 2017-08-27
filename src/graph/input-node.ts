import { GLOBALS, GNode } from '../graph/g-node';
import { ImmutableList } from '../immutable';

export class InputNode<T> extends GNode<T> {
  private readonly symbol_: symbol = Symbol('inputNode');

  constructor() {
    super(ImmutableList.of([]));
  }

  protected execute_(context: {}): T {
    return context[this.symbol_];
  }

  set(context: {} | null, value: T): void {
    this.set_(context || GLOBALS, value);
  }

  private set_(context: {}, value: T): void {
    context[this.symbol_] = value;
  }
}
