import { Collection } from '.';

export interface Tree<K, V, C extends Collection<V>> {
  getChildNode(key: K): Tree<K, V, C> | null;

  getChildren(): C;

  getValue(): V;

  postOrder(): Iterable<Tree<K, V, C>>;

  preOrder(): Iterable<Tree<K, V, C>>;

  setValue(value: V): Tree<K, V, C>;
}
