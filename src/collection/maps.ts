import BaseFluent from './base-fluent';


export class FluentMap<K, V> extends BaseFluent<Map<K, V>> {
  constructor(data: Map<K, V>) {
    super(data);
  }

  forEach(fn: (value: V, key: K) => any): FluentMap<K, V> {
    this.data.forEach((value: V, key: K) => {
      fn(value, key);
    });
    return this;
  }
}

const Maps = {
  of<K, V>(data: Map<K, V>): FluentMap<K, V> {
    return new FluentMap<K, V>(data);
  },

  fromRecord<V>(record: { [key: string]: V }): FluentMap<string, V> {
    let entries = [];
    for (let key in record) {
      entries.push([key, record[key]]);
    }

    return Maps.of(new Map<string, V>(entries));
  },
};

export default Maps;
