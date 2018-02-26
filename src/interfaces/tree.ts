import { Collection } from '../interfaces';

export interface Tree<K, V, C extends Collection<V>> {
  getChildNode(key: K): Tree<K, V, C> | null;

  getChildren(): C;

  getValue(): V;

  setValue(value: V): Tree<K, V, C>;
}
