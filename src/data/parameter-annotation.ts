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
import { asImmutableList, createImmutableList, ImmutableList } from '../collection/types/immutable-list';
import { asImmutableMap, ImmutableMap } from '../collection/types/immutable-map';
import { createInfiniteMap } from '../collection/types/infinite-map';

type Annotator<A extends any[], D> = (
    target: Object,
    key: string|symbol,
    index: number,
    ...args: A) => D;

export class ParameterAnnotation<D> {
  constructor(
      private readonly data: ImmutableMap<
          Object,
          ImmutableMap<
              string|symbol,
              ImmutableMap<number, ImmutableList<D>>
          >
      >,
  ) { }

  getAll(): ImmutableMap<
      Object,
      ImmutableMap<string|symbol, ImmutableMap<number, ImmutableList<D>>>
  > {
    return this.data;
  }

  getAttachedValues(
      ctorFn: Object,
      key: string|symbol,
      index: number,
  ): ImmutableMap<Object, ImmutableList<D>> {
    const ctorChain = [...getCtorChain(ctorFn)];

    return pipe(
        this.data,
        getKey(...ctorChain),
        mapPick(
            1,
            keyToDataMap => pipe(
                keyToDataMap,
                getKey(key),
                mapPick(
                    1,
                    indexToDataMap => pipe(
                        indexToDataMap,
                        getKey(index),
                        pick(1),
                        head(),
                    ),
                ),
                filterPick(1, (data): data is ImmutableList<D> => !!data),
                pick(1),
                flat<D>(),
                declareFinite(),
                asImmutableList(),
            ),
        ),
        sort(Orderings.map(([ctor]) => ctor, Orderings.following<Object>(ctorChain))),
        asImmutableMap<Object, ImmutableList<D>>(),
    );
  }

  getAttachedValuesForCtor(
      ctorFn: Object,
  ): ImmutableMap<string|symbol, ImmutableMap<number, ImmutableMap<Object, ImmutableList<D>>>> {
    return pipe(
        // Get the keys
        this.data,
        getKey(...getCtorChain(ctorFn)),
        pick(1),
        flat<[string|symbol, ImmutableMap<number, ImmutableList<D>>]>(),
        declareKeyed(([key]) => key),
        keys(),
        distinct<string|symbol, any>(),
        map(key => [
          key,
          this.getAttachedValuesForKey(ctorFn, key),
        ] as [string|symbol, ImmutableMap<number, ImmutableMap<Object, ImmutableList<D>>>]),
        declareFinite(),
        asImmutableMap(),
    );
  }

  getAttachedValuesForKey(
      ctorFn: Object,
      key: string|symbol,
  ): ImmutableMap<number, ImmutableMap<Object, ImmutableList<D>>> {
    return pipe(
        // Get the indexes.
        pipe(
            this.data,
            getKey(...getCtorChain(ctorFn)()),
            pick(1),
            flat<[string|symbol, ImmutableMap<number, ImmutableList<D>>]>(),
            declareKeyed(([key]) => key),
            getKey(key),
            pick(1),
            flat<[number, ImmutableList<D>]>(),
            declareKeyed(([index]) => index),
            keys(),
            distinct<number, any>(),
        ),
        map(index => [
          index,
          this.getAttachedValues(ctorFn, key, index),
        ] as [number, ImmutableMap<Object, ImmutableList<D>>]),
        declareFinite(),
        declareKeyed(([index]) => index),
        asImmutableMap(),
    );
  }
}

export class ParameterAnnotator<D, A extends any[]> {
  private readonly dataMap: Map<Object, Map<string|symbol, Map<number, D[]>>> = new Map();

  constructor(
      private readonly annotator: Annotator<A, D>,
  ) { }

  get data(): ParameterAnnotation<D> {
    return new ParameterAnnotation(
        pipe(
            createInfiniteMap(this.dataMap),
            mapPick(
                1,
                mapObj => pipe(
                    createInfiniteMap(mapObj),
                    mapPick(
                        1,
                        subMapObj => pipe(
                            createInfiniteMap(subMapObj),
                            mapPick(
                                1,
                                data => createImmutableList<D>(data),
                            ),
                            declareFinite(),
                            asImmutableMap(),
                        ),
                    ),
                    declareFinite(),
                    asImmutableMap(),
                ),
            ),
            declareFinite(),
            asImmutableMap(),
        ),
    );
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

function getCtorChain(ctorFn: Object): ImmutableList<Object> {
  const ctors: Object[] = [];
  let currentCtor = ctorFn;
  while (currentCtor !== null) {
    ctors.push(currentCtor);
    currentCtor = Object.getPrototypeOf(currentCtor);
  }

  return createImmutableList(ctors);
}
