import { Observable } from 'rxjs';
import { ImmutableMap } from '../collect/types/immutable-map';

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

export interface MapObservable<K, V> {
  getDiffs(): Observable<MapDiff<K, V>>;

  getObs(): Observable<ImmutableMap<K, V>>;
}
