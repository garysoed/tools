import { Observable } from '@rxjs';
import { scan } from '@rxjs/operators';

export interface MapInit<K, V> {
  type: 'init';
  value: Map<K, V>;
}

export interface MapDelete<K> {
  key: K;
  type: 'delete';
}

export interface MapSet<K, V> {
  key: K;
  type: 'set';
  value: V;
}

export type MapDiff<K, V> = MapInit<K, V>|MapDelete<K>|MapSet<K, V>;

export function scanMap<K, V>():
    (obs: Observable<MapDiff<K, V>>) => Observable<ReadonlyMap<K, V>> {
  return obs => obs.pipe(
      scan<MapDiff<K, V>, Map<K, V>>(
          (acc, diff) => {
            switch (diff.type) {
              case 'delete':
                return new Map([...acc].filter(([key]) => key !== diff.key));
              case 'init':
                return new Map(diff.value);
              case 'set':
                return new Map([...acc, [diff.key, diff.value]]);
            }
          },
          new Map(),
      ),
  );
}
