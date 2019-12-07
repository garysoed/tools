import { declareFinite } from '../collection/operators/declare-finite';
import { declareKeyed } from '../collection/operators/declare-keyed';
import { distinct } from '../collection/operators/distinct';
import { filterPick } from '../collection/operators/filter-pick';
import { flat } from '../collection/operators/flat';
import { getKey } from '../collection/operators/get-key';
import { head } from '../collection/operators/head';
import { keys } from '../collection/operators/keys';
import { map } from '../collection/operators/map';
import { mapPick } from '../collection/operators/map-pick';
import { pick } from '../collection/operators/pick';
import { sort } from '../collection/operators/sort';
import { Orderings } from '../collection/orderings';
import { pipe } from '../collection/pipe';
import { createImmutableList, ImmutableList } from '../collection/types/immutable-list';
import { asImmutableMap, createImmutableMap, ImmutableMap } from '../collection/types/immutable-map';

type Annotator<A extends any[], D> = (target: Object, key: string|symbol, ...args: A) => D;

export class PropertyAnnotation<D> {
  constructor(
      private readonly data: ImmutableMap<Object, ImmutableMap<string|symbol, ImmutableList<D>>>,
  ) { }

  getAll(): ImmutableMap<Object, ImmutableMap<string|symbol, ImmutableList<D>>> {
    return this.data;
  }

  getAttachedValues(ctorFn: Object, key: string|symbol): ImmutableMap<Object, ImmutableList<D>> {
    const ctorChain = [...getCtorChain(ctorFn)()];

    return pipe(
        this.data,
        getKey(...ctorChain),
        mapPick(
            1,
            keyToDataMap => pipe(
                keyToDataMap,
                getKey(key),
                pick(1),
                head(),
            ),
        ),
        filterPick(1, (data): data is ImmutableList<D> => !!data),
        sort(Orderings.map(([ctor]) => ctor, Orderings.following<Object>(ctorChain))),
        asImmutableMap(),
    );
  }

  getAttachedValuesForCtor(
      ctorFn: Object,
  ): ImmutableMap<string|symbol, ImmutableMap<Object, ImmutableList<D>>> {
    return pipe(
        // Get the keys
        pipe(
            this.data,
            getKey(...getCtorChain(ctorFn)()),
            pick(1),
            flat<[string|symbol, ImmutableList<D>]>(),
            declareKeyed(([key]) => key),
            keys(),
            distinct<string|symbol, any>(),
        ),
        map(key => [
          key,
          this.getAttachedValues(ctorFn, key),
        ] as [string|symbol, ImmutableMap<Object, ImmutableList<D>>]),
        declareKeyed(([key]) => key),
        declareFinite(),
        asImmutableMap(),
    );
  }
}

export class PropertyAnnotator<D, A extends any[]> {
  private readonly dataMap: Map<Object, Map<string|symbol, D[]>> = new Map();

  constructor(
      private readonly annotator: Annotator<A, D>,
  ) { }

  get data(): PropertyAnnotation<D> {
    return new PropertyAnnotation(
        pipe(
            createImmutableMap(this.dataMap),
            mapPick(
                1,
                mapObj => pipe(
                    createImmutableMap(mapObj),
                    mapPick(1, data => createImmutableList(data)),
                    asImmutableMap(),
                ),
            ),
            asImmutableMap(),
        ),
    );
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

function getCtorChain(ctorFn: Object): ImmutableList<Object> {
  const ctors: Object[] = [];
  let currentCtor = ctorFn;
  while (currentCtor !== null) {
    ctors.push(currentCtor);
    currentCtor = Object.getPrototypeOf(currentCtor);
  }

  return createImmutableList(ctors);
}
