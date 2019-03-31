import { concat, Observable, of as observableOf, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';

export interface MapInit<K, V> {
  payload: Map<K, V>;
  type: 'init';
}

export interface MapDelete<K> {
  key: K;
  type: 'delete';
}

export interface MapSet<K, V> {
  key: K;
  value: V;
  type: 'set';
}

export type MapDiff<K, V> = MapInit<K, V>|MapDelete<K>|MapSet<K, V>;

export class MapSubject<K, V> {
  private readonly innerMap: Map<K, V>;
  private readonly diffSubject: Subject<MapDiff<K, V>> = new Subject();

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
        observableOf<MapInit<K, V>>({payload: new Map([...this.innerMap]), type: 'init'}),
        this.diffSubject,
    );
  }

  getObs(): Observable<Map<K, V>> {
    return this.diffSubject.pipe(mapTo(this.innerMap));
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

  set(key: K, value: V): void {
    if (this.innerMap.get(key) === value) {
      return;
    }

    this.innerMap.set(key, value);
    this.diffSubject.next({key, value, type: 'set'});
  }
}
