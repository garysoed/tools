import { concat, Observable, of as observableOf, Subject } from '@rxjs';
import { map, shareReplay } from '@rxjs/operators';
import { createImmutableMap, ImmutableMap } from '../../collect/types/immutable-map';
import { MapDiff, MapInit, MapObservable } from './map-observable';

export class MapSubject<K, V> implements MapObservable<K, V> {
  private readonly diffSubject: Subject<MapDiff<K, V>> = new Subject();
  private readonly innerMap: Map<K, V>;

  constructor(init: Iterable<[K, V]> = []) {
    this.innerMap = new Map([...init]);
  }

  delete(key: K): void {
    if (!this.innerMap.has(key)) {
      return;
    }

    this.innerMap.delete(key);
    this.diffSubject.next({key, type: 'delete'});
  }

  getDiffs(): Observable<MapDiff<K, V>> {
    return concat(
        observableOf<MapInit<K, V>>({value: new Map([...this.innerMap]), type: 'init'}),
        this.diffSubject,
    );
  }

  set(key: K, value: V): void {
    if (this.innerMap.get(key) === value) {
      return;
    }

    this.innerMap.set(key, value);
    this.diffSubject.next({key, value, type: 'set'});
  }

  setAll(newItems: Map<K, V>): void {
    // Delete the extra items.
    for (const [existingKey] of this.innerMap) {
      if (!newItems.has(existingKey)) {
        this.delete(existingKey);
      }
    }

    // Insert the missing items.
    for (const [newKey, newValue] of newItems) {
      if (this.innerMap.get(newKey) !== newValue) {
        this.set(newKey, newValue);
      }
    }
  }
}
