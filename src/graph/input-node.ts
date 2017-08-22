import { ImmutableList } from 'src/immutable';
import { GNode } from '../graph/g-node';

export class InputNode<T> extends GNode<T> {
  constructor(private value_: T) {
    super(ImmutableList.of([]));
  }

  execute(): T {
    return this.value_;
  }

  set(value: T): void {
    this.value_ = value;
  }
}
