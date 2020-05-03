import { of as observableOf, OperatorFunction, pipe } from 'rxjs';
import { map, pairwise, startWith, switchMap } from 'rxjs/operators';

import { MapDiff } from './map-observable';

export function diff<K, V>(
    oldMap: ReadonlyMap<K, V>,
    newMap: ReadonlyMap<K, V>,
): ReadonlyArray<MapDiff<K, V>> {
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
}

export function diffMap<K, V>(): OperatorFunction<ReadonlyMap<K, V>, MapDiff<K, V>> {
  return pipe(
      startWith(new Map<K, V>()),
      pairwise(),
      map(([oldMap, newMap]) => diff(oldMap, newMap)),
      switchMap(diffs => observableOf(...diffs)),
  );
}
