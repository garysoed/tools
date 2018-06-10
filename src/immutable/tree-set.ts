import { cache } from '../data/cache';
import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Tree } from '../interfaces/tree';

type MapFn<V, V2> = (node: TreeSet<V>, parent: TreeSet<V> | null) => V2;

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

  map<V2>(fn: MapFn<V, V2>): TreeSet<V2> {
    return this.mapHelper_(fn, null);
  }

  private mapHelper_<V2>(
      fn: MapFn<V, V2>,
      parent: TreeSet<V> | null): TreeSet<V2> {
    const newValue = fn(this, parent);
    const newChildren = this.childNodes_.mapItem(([, value]) => {
      const newNode = value.mapHelper_(fn, this);
      return newNode;
    });
    return TreeSet.of(newValue, newChildren);
  }

  @cache()
  postOrder(): ImmutableList<TreeSet<V>> {
    return this.childNodes_
        .map(node => node.postOrder())
        .reduce((prevValue, value) => prevValue.addAll(value), ImmutableList.of<TreeSet<V>>([]))
        .add(this);
  }

  @cache()
  preOrder(): ImmutableList<TreeSet<V>> {
    const descendants = this.childNodes_
        .map(node => node.preOrder())
        .reduce((prevValue, value) => prevValue.addAll(value), ImmutableList.of<TreeSet<V>>([]));
    return ImmutableList.of([this, ...descendants]);
  }

  setValue(value: V): TreeSet<V> {
    return new TreeSet(value, this.childNodes_);
  }

  static of<T>(value: T, children: Iterable<TreeSet<T>> = new Set()): TreeSet<T> {
    const mapContent = ImmutableSet.of([...children])
        .mapItem(child => [child.getValue(), child] as [T, TreeSet<T>]);
    return new TreeSet(value, ImmutableMap.of(mapContent));
  }
}
