import { InstanceofType, NonNullType, TupleOfType } from 'gs-types/export';
import { cache } from '../data/cache';
import { ImmutableList } from './immutable-list';
import { ImmutableMap } from './immutable-map';
import { ImmutableSet } from './immutable-set';
import { Collection } from '../interfaces';
import { Tree } from '../interfaces/tree';

type MapFn<K, V, K2, V2> =
    (node: TreeMap<K, V>, key: K | null, parent: TreeMap<K, V> | null) => [K2 | null, V2];

/**
 * Tree whose child nodes are indexed by the keys.
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

  map<K2, V2>(fn: MapFn<K, V, K2, V2>): TreeMap<K2, V2> {
    return this.mapHelper_(fn, null, null)[1];
  }

  private mapHelper_<K2, V2>(
      fn: MapFn<K, V, K2, V2>,
      key: K | null,
      parent: TreeMap<K, V> | null): [K2 | null, TreeMap<K2, V2>] {
    const [newKey, newValue] = fn(this, key, parent);
    const newChildren = ImmutableMap
        .of(this.childNodes_.mapItem(([key, value]) => {
          return value.mapHelper_(fn, key, this);
        }))
        .filterByType((TupleOfType([NonNullType<K2>(), InstanceofType<TreeMap<K2, V2>>(TreeMap)])));
    return [newKey, TreeMap.of(newValue, newChildren)];
  }

  @cache()
  postOrder(): ImmutableList<TreeMap<K, V>> {
    return this.childNodes_
        .map(node => node.postOrder())
        .reduce((prevValue, value) => prevValue.addAll(value), ImmutableList.of<TreeMap<K, V>>([]))
        .add(this);
  }

  @cache()
  preOrder(): ImmutableList<TreeMap<K, V>> {
    const descendants = this.childNodes_
        .map(node => node.preOrder())
        .reduce((prevValue, value) => prevValue.addAll(value), ImmutableList.of<TreeMap<K, V>>([]));
    return ImmutableList.of([this, ...descendants]);
  }

  set(key: K, value: TreeMap<K, V>): TreeMap<K, V> {
    return new TreeMap(this.value_, this.childNodes_.set(key, value));
  }

  setValue(value: V): TreeMap<K, V> {
    return new TreeMap(value, this.childNodes_);
  }

  static of<K, V>(
      value: V,
      children: Iterable<[K, TreeMap<K, V>]> = new Map<K, TreeMap<K, V>>()): TreeMap<K, V> {
    return new TreeMap(value, ImmutableMap.of<K, TreeMap<K, V>>([...children]));
  }

  static async promiseAll<K, V>(tree: TreeMap<K, Promise<V>>): Promise<TreeMap<K, V>> {
    const promises: Promise<[Tree<K, Promise<V>, Collection<Promise<V>>>, V]>[] = [];
    for (const node of tree.postOrder()) {
      promises.push(Promise.all([node, node.getValue()]));
    }

    const results = await Promise.all(promises);
    const resultsMap = ImmutableMap.of(results);
    return tree.map((node, key) => [key, resultsMap.get(node)!]);
  }
}
