import { pipe } from '../collect/pipe';
import { declareFinite } from '../collect/operators/declare-finite';
import { declareKeyed } from '../collect/operators/declare-keyed';
import { distinct } from '../collect/operators/distinct';
import { flat } from '../collect/operators/flat';
import { getKey } from '../collect/operators/get-key';
import { keys } from '../collect/operators/keys';
import { map } from '../collect/operators/map';
import { mapPick } from '../collect/operators/map-pick';
import { pick } from '../collect/operators/pick';
import { sort } from '../collect/operators/sort';
import { Orderings } from '../collect/orderings';
import { asImmutableList, createImmutableList, ImmutableList } from '../collect/types/immutable-list';
import { asImmutableMap, createImmutableMap, ImmutableMap } from '../collect/types/immutable-map';

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

  getAllValues(): ImmutableMap<
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
                pick(1),
                flat<[number, ImmutableList<D>]>(),
                declareKeyed(([index]) => index),
                getKey(index),
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
        pipe(
            this.data,
            getKey(...getCtorChain(ctorFn)),
            pick(1),
            flat<[string|symbol, ImmutableMap<number, ImmutableList<D>>]>(),
            declareKeyed(([key]) => key),
            keys(),
            distinct<string|symbol, any>(),
        ),
        map(key => [
          key,
          this.getAttachedValuesForKey(ctorFn, key),
        ] as [string|symbol, ImmutableMap<number, ImmutableMap<Object, ImmutableList<D>>>]),
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
            getKey(...getCtorChain(ctorFn)),
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
            createImmutableMap(this.dataMap),
            mapPick(
                1,
                mapObj => pipe(
                    createImmutableMap(mapObj),
                    mapPick(
                        1,
                        subMapObj => pipe(
                            createImmutableMap(subMapObj),
                            mapPick(1, data => createImmutableList<D>(data)),
                            asImmutableMap(),
                        ),
                    ),
                    asImmutableMap(),
                ),
            ),
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
