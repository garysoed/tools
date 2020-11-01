import { OperatorFunction, of as observableOf, pipe } from 'rxjs';
import { map, pairwise, scan, startWith, switchMap } from 'rxjs/operators';

/**
 * Initializes the map by setting it to the given map.
 *
 * @typeParam K - Type of the map keys.
 * @typeParam V - Type of the map values.
 * @thHidden
 */
export interface MapInit<K, V> {
  readonly type: 'init';
  readonly value: ReadonlyMap<K, V>;
}

/**
 * Deletes the entry from the map.
 *
 * @typeParam K - Type of the map keys.
 * @typeParam V - Type of the map values.
 * @thHidden
 */
export interface MapDelete<K> {
  readonly key: K;
  readonly type: 'delete';
}

/**
 * Sets the entry of the map.
 *
 * @typeParam K - Type of the map keys.
 * @typeParam V - Type of the map values.
 * @thHidden
 */
export interface MapSet<K, V> {
  readonly key: K;
  readonly type: 'set';
  readonly value: V;
}

/**
 * Differences between maps.
 *
 * @typeParam K - Type of the map keys.
 * @typeParam V - Type of the map values.
 * @thHidden
 */
export type MapDiff<K, V> = MapInit<K, V>|MapDelete<K>|MapSet<K, V>;

/**
 * Emits diffs of the input maps.
 *
 * @remarks
 * The first emission is always compared to empty map. Note that if the input map emissions
 * change a lot, there can be more output diffs than the input maps.
 *
 * @typeParam K - Type of the map keys.
 * @typeParam V - Type of the map values.
 * @returns Operator that takes in maps and emits diffs between subsequent map emissions.
 *
 * @thModule rxjs.state
 */
export function diffMap<K, V>(): OperatorFunction<ReadonlyMap<K, V>, MapDiff<K, V>> {
  return pipe(
      startWith(new Map<K, V>()),
      pairwise(),
      map(([oldMap, newMap]) => {
        const diffs: Array<MapDiff<K, V>> = [];

        // Delete the extra items.
        for (const [key] of oldMap) {
          if (!newMap.has(key)) {
            diffs.push({key, type: 'delete'});
          }
        }

        // Insert the missing items.
        for (const [key, newValue] of newMap) {
          const oldValue = oldMap.get(key);
          if (oldValue !== newValue) {
            diffs.push({key, value: newValue, type: 'set'});
          }
        }

        return diffs;
      }),
      switchMap(diffs => observableOf(...diffs)),
  );
}


/**
 * Maps the value of the map diffs.
 *
 * @typeParam K - Type of the map keys.
 * @typeParam V1 - Original type of the map values.
 * @typeParam V2 - Destination type of the map values.
 * @param mapFn - Map function to apply.
 * @returns Operator that maps the values of any input map diff using the given mapping function.
 *
 * @thModule rxjs.state
 */
export function mapValueMapDiff<K, V1, V2>(mapFn: (from: V1, key: K) => V2):
    OperatorFunction<MapDiff<K, V1>, MapDiff<K, V2>> {
  return pipe(
      map(diff => {
        switch (diff.type) {
          case 'delete':
            return diff;
          case 'init':{
            const newMap = new Map<K, V2>();
            for (const [key, value] of diff.value) {
              const newValue = mapFn(value, key);
              newMap.set(key, newValue);
            }
            return {
              type: 'init',
              value: newMap,
            };
          }
          case 'set':
            return {
              key: diff.key,
              type: 'set',
              value: mapFn(diff.value, diff.key),
            };
        }
      }),
  );
}

/**
 * Given a sequence of `MapDiff`s, rebuild the map.
 *
 * @typeParam K - Type of the map keys.
 * @typeParam V - Type of the map values.
 * @returns Operator that emits maps as applied to the input diffs.
 * @thModule rxjs.state
 */
export function scanMap<K, V>(): OperatorFunction<MapDiff<K, V>, ReadonlyMap<K, V>> {
  return pipe(
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
