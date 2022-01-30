import {diffValue} from './diff-value';


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
 * @thModule collect
 */
export function diffMap<K, V>(
    fromMap: ReadonlyMap<K, V>,
    toMap: ReadonlyMap<K, V>,
    diffFn: (a: V, b: V) => boolean = (a, b) => a === b,
): ReadonlyArray<MapDiff<K, V>> {
  const diffs: Array<MapDiff<K, V>> = [];

  // Delete the extra items.
  for (const [key] of fromMap) {
    if (!toMap.has(key)) {
      diffs.push({key, type: 'delete'});
    }
  }

  // Insert the missing items.
  for (const [key, newValue] of toMap) {
    const oldValue = fromMap.get(key);
    if (!diffValue(oldValue, newValue, diffFn)) {
      diffs.push({key, value: newValue, type: 'set'});
    }
  }

  return diffs;
}

/**
 * Given a sequence of `MapDiff`s, rebuild the map.
 *
 * @typeParam K - Type of the map keys.
 * @typeParam V - Type of the map values.
 * @returns Operator that emits maps as applied to the input diffs.
 * @thModule collect
 */
export function undiffMap<K, V>(
    initMap: ReadonlyMap<K, V>,
    diffs: ReadonlyArray<MapDiff<K, V>>,
): ReadonlyMap<K, V> {
  return diffs.reduce(
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
      initMap,
  );
}
