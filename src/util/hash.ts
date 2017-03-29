export const HASHED_VALUES: Map<any, number> = new Map();
export const HASHED_OBJECTS: WeakMap<Object, number> = new WeakMap();
export const GLOBALS = {lastHash: 0};


type MapLike<K, V> = {
  has(key: K): boolean;
  get(key: K): V | undefined;
  set(key: K, value: V): void;
};

export function hash(object: Object): string;
export function hash(object: any): string {
  const mapLike: MapLike<any, number> = object instanceof Object ? HASHED_OBJECTS : HASHED_VALUES;
  if (!mapLike.has(object)) {
    mapLike.set(object, GLOBALS.lastHash);
    GLOBALS.lastHash++;
  }
  return `${mapLike.get(object)}`;
}
