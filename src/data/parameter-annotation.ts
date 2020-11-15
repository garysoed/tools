/* eslint-disable @typescript-eslint/ban-types */
import {following} from '../collect/compare/following';
import {withMap} from '../collect/compare/with-map';
import {OrderedMap} from '../collect/structures/ordered-map';
import {ReadonlyOrderedMap} from '../collect/structures/readonly-ordered-map';


type Annotator<A extends any[], D> = (
    target: Object,
    key: string|symbol,
    index: number,
    ...args: A) => D;

export class ParameterAnnotation<D> {
  constructor(
      private readonly data: ReadonlyMap<
          Object,
          ReadonlyMap<
              string|symbol,
              ReadonlyMap<number, readonly D[]>
          >
      >,
  ) { }

  getAll(): ReadonlyMap<
      Object,
      ReadonlyMap<string|symbol, ReadonlyMap<number, readonly D[]>>
      > {
    return this.data;
  }

  getAttachedValues(
      ctorFn: Object,
      key: string|symbol,
      index: number,
  ): ReadonlyOrderedMap<Object, readonly D[]> {
    const ctorChain = getCtorChain(ctorFn);
    const ctorSet = new Set(ctorChain);

    const collectedInheritanceMap = new OrderedMap<Object, D[]>();
    for (const [ctor, propertyKeyMap] of this.data) {
      if (!ctorSet.has(ctor)) {
        continue;
      }

      const collectedValues: D[] = collectedInheritanceMap.get(ctor) || [];
      for (const [propertyKey, paramMap] of propertyKeyMap) {
        if (propertyKey !== key) {
          continue;
        }

        for (const [annotatedIndex, values] of paramMap) {
          if (annotatedIndex !== index) {
            continue;
          }
          collectedValues.push(...values);
        }
      }
      collectedInheritanceMap.set(ctor, collectedValues);
    }

    sortInheritanceMap(collectedInheritanceMap, ctorChain);
    return collectedInheritanceMap;
  }

  getAttachedValuesForCtor(
      ctorFn: Object,
  ): ReadonlyMap<string|symbol, ReadonlyMap<number, ReadonlyOrderedMap<Object, readonly D[]>>> {
    const ctorChain = getCtorChain(ctorFn);
    const ctorSet = new Set(ctorChain);
    const collectedPropertyKeyMap = new Map<string|symbol, Map<number, OrderedMap<Object, D[]>>>();
    for (const [ctor, propertyKeyMap] of this.data) {
      if (!ctorSet.has(ctor)) {
        continue;
      }

      // Deeply insert the map.
      for (const [propertyKey, paramMap] of propertyKeyMap) {
        const collectedParamMap = collectedPropertyKeyMap.get(propertyKey) ||
            new Map<number, OrderedMap<Object, D[]>>();
        for (const [index, values] of paramMap) {
          const collectedInheritanceMap = collectedParamMap.get(index) ||
              new OrderedMap<Object, D[]>();
          const collectedValues: D[] = collectedInheritanceMap.get(ctor) || [];
          collectedValues.push(...values);
          collectedInheritanceMap.set(ctor, collectedValues);
          collectedParamMap.set(index, collectedInheritanceMap);
        }
        collectedPropertyKeyMap.set(propertyKey, collectedParamMap);
      }
    }

    // Sort the OrderedMaps.
    for (const [, paramMap] of collectedPropertyKeyMap) {
      for (const [, inheritanceMap] of paramMap) {
        inheritanceMap.sort(withMap(([ctor]) => ctor, following<Object>(ctorChain)));
      }
    }

    return collectedPropertyKeyMap;
  }

  getAttachedValuesForKey(
      ctorFn: Object,
      key: string|symbol,
  ): ReadonlyMap<number, ReadonlyOrderedMap<Object, readonly D[]>> {
    const collectedParamMap = new Map<number, OrderedMap<Object, D[]>>();
    const ctorChain = getCtorChain(ctorFn);
    const ctorSet = new Set(ctorChain);
    for (const [ctor, propertyKeyMap] of this.data) {
      if (!ctorSet.has(ctor)) {
        continue;
      }

      for (const [propertyKey, paramMap] of propertyKeyMap) {
        if (propertyKey !== key) {
          continue;
        }

        for (const [index, values] of paramMap) {
          const collectedInheritanceMap = collectedParamMap.get(index) ||
              new OrderedMap<Object, D[]>();
          const collectedValues: D[] = collectedInheritanceMap.get(ctor) || [];
          collectedValues.push(...values);
          collectedInheritanceMap.set(ctor, collectedValues);
          collectedParamMap.set(index, collectedInheritanceMap);
        }
      }
    }

    // Sort the inheritance maps.
    for (const [, inheritanceMap] of collectedParamMap) {
      sortInheritanceMap(inheritanceMap, ctorChain);
    }

    return collectedParamMap;
  }
}

export class ParameterAnnotator<D, A extends any[]> {
  private readonly dataMap: Map<Object, Map<string|symbol, Map<number, D[]>>> = new Map();

  constructor(
      private readonly annotator: Annotator<A, D>,
  ) { }

  get data(): ParameterAnnotation<D> {
    return new ParameterAnnotation(this.dataMap);
  }

  get decorator(): (...args: A) => ParameterDecorator {
    return (...args: A) => {
      return (target: Object, propertyKey: string | symbol, index: number) => {
        const data = this.annotator(target, propertyKey, index, ...args);

        const ctor = target.constructor;
        const keyMap = this.dataMap.get(ctor) || new Map<string|symbol, Map<number, D[]>>();
        const subMap = keyMap.get(propertyKey) || new Map<number, D[]>();
        const dataList = subMap.get(index) || [];
        dataList.push(data);
        subMap.set(index, dataList);
        keyMap.set(propertyKey, subMap);
        this.dataMap.set(ctor, keyMap);
      };
    };
  }
}

function getCtorChain(ctorFn: Object): readonly Object[] {
  const ctors: Object[] = [];
  let currentCtor: Object|null = ctorFn;
  while (currentCtor !== null) {
    ctors.push(currentCtor);
    currentCtor = Object.getPrototypeOf(currentCtor);
  }

  return ctors;
}

function sortInheritanceMap(
    inheritanceMap: OrderedMap<Object, unknown>,
    ctorChain: readonly Object[],
): void {
  inheritanceMap.sort(withMap(([ctor]) => ctor, following<Object>(ctorChain)));
}
