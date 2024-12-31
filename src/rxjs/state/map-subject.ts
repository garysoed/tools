import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class MapSubject<K, V> extends BehaviorSubject<ReadonlyMap<K, V>> {
  constructor(initValue?: ReadonlyMap<K, V>) {
    super(initValue ?? new Map());
  }

  get(key: K): Observable<V | undefined> {
    return this.pipe(map((value) => value.get(key)));
  }
  set(key: K, value: V): void {
    this.update((oldMap) => {
      const newMap = new Map(oldMap);
      newMap.set(key, value);
      return newMap;
    });
  }

  private update(
    modifierFn: (input: ReadonlyMap<K, V>) => ReadonlyMap<K, V>,
  ): void {
    const value = this.getValue();
    this.next(modifierFn(value));
  }
}
