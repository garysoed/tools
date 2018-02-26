import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Tree } from '../interfaces/tree';

/**
 * Tree whose child nodes are indexed by the values.
 */
export class TreeMap<K, V> implements Tree<K, V, ImmutableSet<V>> {
  constructor(
      private readonly value_: V,
      private readonly childNodes_: ImmutableMap<K, TreeMap<K, V>> = ImmutableMap.of([])) { }

  delete(key: K): TreeMap<K, V> {
    return new TreeMap(this.value_, this.childNodes_.deleteKey(key));
  }

  getChildNode(key: K): TreeMap<K, V> | null {
    return this.childNodes_.get(key) || null;
  }

  getChildren(): ImmutableSet<V> {
    return this.childNodes_.mapItem(([, node]) => node.getValue());
  }

  getKeys(): ImmutableSet<K> {
    return this.childNodes_.keys();
  }

  getValue(): V {
    return this.value_;
  }

  set(key: K, value: TreeMap<K, V>): TreeMap<K, V> {
    return new TreeMap(this.value_, this.childNodes_.set(key, value));
  }

  setValue(value: V): TreeMap<K, V> {
    return new TreeMap(value, this.childNodes_);
  }

  static of<K, V>(value: V, children: Iterable<[K, V]> = new Map<K, V>()): TreeMap<K, V> {
    return new TreeMap(
        value,
        ImmutableMap.of<K, V>([])
            .addAll(ImmutableSet.of([...children]))
            .map((value) => TreeMap.of(value)));
  }
}
