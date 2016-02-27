import BaseFluent from './base-fluent';


export class FluentMap<K, V> extends BaseFluent<Map<K, V>> {
  constructor(data: Map<K, V>) {
    super(data);
  }

  forEach(fn: (key: K, value: V) => any): FluentMap<K, V> {
    this.data.forEach((value: V, key: K) => {
      fn(key, value);
    });
    return this;
  }
}

export default {
  of<K, V>(data: Map<K, V>): FluentMap<K, V> {
    return new FluentMap<K, V>(data);
  },
}
