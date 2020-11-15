/* eslint-disable @typescript-eslint/ban-types */
import {following} from '../collect/compare/following';
import {withMap} from '../collect/compare/with-map';
import {asArray} from '../collect/operators/as-array';
import {asOrderedMap} from '../collect/operators/as-ordered-map';
import {filter} from '../collect/operators/filter';
import {$pipe} from '../collect/operators/pipe';


interface AnnotationResult<D> {
  data: D;
  newTarget: Function|void;
}

type Annotator<A extends any[], D> = (target: Function, ...args: A) => AnnotationResult<D>;

export class ClassAnnotation<D> {
  constructor(
      private readonly data: ReadonlyMap<Function, readonly D[]>,
  ) { }

  getAllValues(): ReadonlyMap<Function, readonly D[]> {
    return this.data;
  }

  getAttachedValues(ctorFn: Function): ReadonlyMap<Function, readonly D[]> {
    // Collect the ctor hierarchy.
    const ctors: Function[] = [];
    let currentCtor: Function|null = ctorFn;
    while (currentCtor !== null) {
      ctors.push(currentCtor);
      currentCtor = Object.getPrototypeOf(currentCtor);
    }

    const ctorsSet = new Set(ctors);

    const orderedMap = $pipe(
        this.data,
        filter(([key]) => ctorsSet.has(key)),
        asArray(),
        asOrderedMap(),
    );
    orderedMap.sort(withMap(([ctor]) => ctor, following(ctors)));
    return orderedMap;
  }
}

export class ClassAnnotator<D, A extends any[]> {
  private readonly dataMap: Map<Function, D[]> = new Map<Function, D[]>();

  constructor(
      private readonly annotator: Annotator<A, D>,
  ) { }

  get data(): ClassAnnotation<D> {
    return new ClassAnnotation(this.dataMap);
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

