import { pipe } from '../collect/pipe';
import { getKey } from '../collect/operators/get-key';
import { mapPick } from '../collect/operators/map-pick';
import { sort } from '../collect/operators/sort';
import { Orderings } from '../collect/orderings';
import { createImmutableList, ImmutableList } from '../collect/types/immutable-list';
import { asImmutableMap, createImmutableMap, ImmutableMap } from '../collect/types/immutable-map';

interface AnnotationResult<D, TF extends Function> {
  data: D;
  newTarget: TF|void;
}

type Annotator<A extends any[], D> =
    <TF extends Function>(target: TF, ...args: A) => AnnotationResult<D, TF>;

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

        return newTarget;
      };
    };
  }
}

