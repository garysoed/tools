import { cache } from '../data';
import { ImmutableList } from '../immutable/immutable-list';
import { Tree } from '../interfaces/tree';

/**
 * Tree whose child nodes are indexed by numbers.
 */
export class TreeList<V> implements Tree<number, V, ImmutableList<V>> {
  constructor(
      private readonly value_: V,
      private readonly childNodes_: ImmutableList<TreeList<V>> = ImmutableList.of([])) { }

  add(value: TreeList<V>): TreeList<V> {
    return new TreeList(this.value_, this.childNodes_.add(value));
  }

  deleteAt(key: number): TreeList<V> {
    return new TreeList(this.value_, this.childNodes_.deleteAt(key));
  }

  getChildNode(key: number): TreeList<V> | null {
    return this.childNodes_.get(key) || null;
  }

  @cache()
  getChildren(): ImmutableList<V> {
    return this.childNodes_.map((node) => node.getValue());
  }

  getValue(): V {
    return this.value_;
  }

  @cache()
  postOrder(): ImmutableList<V> {
    return this.childNodes_
        .map((node) => node.postOrder())
        .reduce((prevValue, value) => prevValue.addAll(value), ImmutableList.of<V>([]))
        .add(this.value_);
  }

  @cache()
  preOrder(): ImmutableList<V> {
    const descendants = this.childNodes_
        .map((node) => node.preOrder())
        .reduce((prevValue, value) => prevValue.addAll(value), ImmutableList.of<V>([]));
    return ImmutableList.of([this.value_, ...descendants]);
  }

  set(index: number, value: TreeList<V>): TreeList<V> {
    return new TreeList(this.value_, this.childNodes_.set(index, value));
  }

  setValue(value: V): TreeList<V> {
    return new TreeList(value, this.childNodes_);
  }

  static of<V>(value: V, children: Iterable<V> = []): TreeList<V> {
    return new TreeList(
        value,
        ImmutableList.of([...children]).map((child) => TreeList.of(child)));
  }
}
