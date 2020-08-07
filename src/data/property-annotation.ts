import { following } from '../collect/compare/following';
import { withMap } from '../collect/compare/with-map';
import { asArray } from '../collect/operators/as-array';
import { asMap } from '../collect/operators/as-map';
import { asSet } from '../collect/operators/as-set';
import { filter } from '../collect/operators/filter';
import { flat } from '../collect/operators/flat';
import { map } from '../collect/operators/map';
import { $pipe } from '../collect/operators/pipe';
import { OrderedMap } from '../collect/structures/ordered-map';
import { ReadonlyOrderedMap } from '../collect/structures/readonly-ordered-map';

type Annotator<A extends any[], D> = (target: Object, key: string|symbol, ...args: A) => D;

export class PropertyAnnotation<D> {
  constructor(
      private readonly data: ReadonlyMap<Object, ReadonlyMap<string|symbol, readonly D[]>>,
  ) { }

  getAll(): ReadonlyMap<Object, ReadonlyMap<string|symbol, readonly D[]>> {
    return this.data;
  }

  getAttachedValues(ctorFn: Object, key: string|symbol): ReadonlyOrderedMap<Object, readonly D[]> {
    const ctorChain = getCtorChain(ctorFn);
    const ctorsSet = new Set(ctorChain);

    const entries = $pipe(
        this.data,
        filter(([key]) => ctorsSet.has(key)),
        map(([k, keyToDataMap]) => {
          const dataMap = keyToDataMap.get(key);
          return [k, dataMap] as [Object, ReadonlyArray<D>|undefined];
        }),
        filter((entry): entry is [Object, readonly D[]] => !!entry[1]),
        asArray(),
    );

    entries.sort(withMap(([ctor]) => ctor, following(ctorChain)));
    return new OrderedMap(entries);
  }

  getAttachedValuesForCtor(
      ctorFn: Object,
  ): ReadonlyMap<string|symbol, ReadonlyMap<Object, readonly D[]>> {
    const ctors = new Set([...getCtorChain(ctorFn)]);

    // Get the keys
    const keys = $pipe(
        this.data,
        filter(([key]) => ctors.has(key)),
        map(([, value]) => [...value]),
        flat(),
        map(([key]) => key),
        asSet(),
    );


    return $pipe(
        keys,
        map(key => [
          key,
          this.getAttachedValues(ctorFn, key),
        ] as [string|symbol, ReadonlyMap<Object, readonly D[]>]),
        asMap(),
    );
  }
}

export class PropertyAnnotator<D, A extends any[]> {
  private readonly dataMap: Map<Object, Map<string|symbol, D[]>> = new Map();

  constructor(
      private readonly annotator: Annotator<A, D>,
  ) { }

  get data(): PropertyAnnotation<D> {
    return new PropertyAnnotation(this.dataMap);
  }

  get decorator(): (...args: A) => PropertyDecorator {
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

function getCtorChain(ctorFn: Object): readonly Object[] {
  const ctors: Object[] = [];
  let currentCtor: Object|null = ctorFn;
  while (currentCtor !== null) {
    ctors.push(currentCtor);
    currentCtor = Object.getPrototypeOf(currentCtor);
  }

  return ctors;
}
