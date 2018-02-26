import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Tree } from '../interfaces/tree';

/**
 * Tree whose child nodes are indexed by the values.
 */
export class TreeSet<V> implements Tree<V, V, ImmutableSet<V>> {
  constructor(
      private readonly value_: V,
      private readonly childNodes_: ImmutableMap<V, TreeSet<V>> = ImmutableMap.of([])) { }

  add(node: TreeSet<V>): TreeSet<V> {
    return new TreeSet(
        this.value_,
        this.childNodes_.set(node.getValue(), node));
  }

  delete(value: V): TreeSet<V> {
    return new TreeSet(this.value_, this.childNodes_.deleteKey(value));
  }

  getChildNode(key: V): TreeSet<V> | null {
    return this.childNodes_.get(key) || null;
  }

  getChildren(): ImmutableSet<V> {
    return this.childNodes_.keys();
  }

  getValue(): V {
    return this.value_;
  }

  setValue(value: V): TreeSet<V> {
    return new TreeSet(value, this.childNodes_);
  }

  static of<T>(value: T, children: Iterable<T> = new Set()): TreeSet<T> {
    const mapContent = ImmutableSet.of([...children])
        .mapItem((child) => [child, TreeSet.of(child)] as [T, TreeSet<T>]);
    return new TreeSet(value, ImmutableMap.of(mapContent));
  }
}
