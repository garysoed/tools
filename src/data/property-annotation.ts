import { createImmutableList, ImmutableList } from '../collect/types/immutable-list';
import { createImmutableMap, ImmutableMap } from '../collect/types/immutable-map';

type Annotator<A extends any[], D> = (target: Object, key: string|symbol, ...args: A) => D;

export class PropertyAnnotation<D, A extends any[]> {
  private readonly dataMap: Map<Object, Map<string|symbol, D[]>> =
      new Map<Object, Map<string|symbol, D[]>>();

  constructor(
      private readonly annotator: Annotator<A, D>,
  ) { }

  getAttachedValues(ctorFn: Object, key: string|symbol): ImmutableMap<Object, ImmutableList<D>> {
    const entries: Array<[Object, ImmutableList<D>]> = [];
    let currentCtor = ctorFn;
    while (currentCtor !== null) {
      const keyMap = this.dataMap.get(currentCtor);
      if (keyMap) {
        const data = keyMap.get(key);
        if (data !== undefined) {
          entries.push([currentCtor, createImmutableList(data)]);
        }
      }

      currentCtor = Object.getPrototypeOf(currentCtor);
    }

    return createImmutableMap(entries);
  }

  getAttachedValuesForCtor(
      ctorFn: Object,
  ): ImmutableMap<string|symbol, ImmutableMap<Object, ImmutableList<D>>> {
    const map = new Map<string|symbol, ImmutableMap<Object, ImmutableList<D>>>();
    let currentCtor = ctorFn;
    while (currentCtor !== null) {
      const keyToDataMap = this.dataMap.get(currentCtor) || new Map<string|symbol, D[]>();
      for (const [key] of keyToDataMap) {
        if (map.has(key)) {
          // This is already processed from the descendant class. So skip it.
          continue;
        }
        map.set(key, this.getAttachedValues(currentCtor, key));
      }

      currentCtor = Object.getPrototypeOf(currentCtor);
    }

    return createImmutableMap(map);
  }

  getDecorator(): (...args: A) => PropertyDecorator {
    return (...args: A) => {
      return (target: Object, propertyKey: string | symbol) => {
        const ctor = target.constructor;
        const data = this.annotator(ctor, propertyKey, ...args);

        const keyMap = this.dataMap.get(ctor) || new Map<string|symbol, D[]>();
        const dataList = keyMap.get(propertyKey) || [];
        dataList.push(data);
        keyMap.set(propertyKey, dataList);
        this.dataMap.set(ctor, keyMap);
      };
    };
  }
}
