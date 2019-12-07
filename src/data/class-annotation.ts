import { getKey } from '../collection/operators/get-key';
import { mapPick } from '../collection/operators/map-pick';
import { sort } from '../collection/operators/sort';
import { Orderings } from '../collection/orderings';
import { pipe } from '../collection/pipe';
import { createImmutableList, ImmutableList } from '../collection/types/immutable-list';
import { asImmutableMap, createImmutableMap, ImmutableMap } from '../collection/types/immutable-map';

interface AnnotationResult<D> {
  data: D;
  newTarget: Function|void;
}

type Annotator<A extends any[], D> = (target: Function, ...args: A) => AnnotationResult<D>;

export class ClassAnnotation<D> {
  constructor(
      private readonly data: ImmutableMap<Function, ImmutableList<D>>,
  ) { }

  getAllValues(): ImmutableMap<Function, ImmutableList<D>> {
    return this.data;
  }

  getAttachedValues(ctorFn: Function): ImmutableMap<Function, ImmutableList<D>> {
    // Collect the ctor hierarchy.
    const ctors: Function[] = [];
    let currentCtor = ctorFn;
    while (currentCtor !== null) {
      ctors.push(currentCtor);
      currentCtor = Object.getPrototypeOf(currentCtor);
    }

    return pipe(
        this.data,
        getKey(...ctors),
        sort(Orderings.map(([ctor]) => ctor, Orderings.following(ctors))),
        asImmutableMap(),
    );
  }
}

export class ClassAnnotator<D, A extends any[]> {
  private readonly dataMap: Map<Function, D[]> = new Map<Function, D[]>();

  constructor(
      private readonly annotator: Annotator<A, D>,
  ) { }

  get data(): ClassAnnotation<D> {
    return new ClassAnnotation(
        pipe(
            createImmutableMap(this.dataMap),
            mapPick(1, data => createImmutableList(data)),
            asImmutableMap<Function, ImmutableList<D>>(),
        ),
    );
  }

  get decorator(): (...args: A) => ClassDecorator {
    return (...args: A) => {
      return <TF extends Function>(target: TF) => {
        const {data, newTarget} = this.annotator(target, ...args);
        const dataList = this.dataMap.get(target) || [];
        dataList.push(data);
        this.dataMap.set(target, dataList);

        return newTarget as TF;
      };
    };
  }
}

