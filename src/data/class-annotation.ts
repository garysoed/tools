import { createImmutableList, ImmutableList } from '../collect/types/immutable-list';
import { createImmutableMap, ImmutableMap } from '../collect/types/immutable-map';

interface AnnotationResult<D, TF extends Function> {
  data: D;
  newTarget: TF|void;
}

type Annotator<A extends any[], D> =
    <TF extends Function>(target: TF, ...args: A) => AnnotationResult<D, TF>;

export class ClassAnnotation<D, A extends any[]> {
  private readonly dataMap: Map<Function, D[]> = new Map<Function, D[]>();

  constructor(
      private readonly annotator: Annotator<A, D>,
  ) { }

  getAttachedValues(ctorFn: Function): ImmutableMap<Function, ImmutableList<D>> {
    const entries: Array<[Function, ImmutableList<D>]> = [];
    let currentCtor = ctorFn;
    while (currentCtor !== null) {
      const dataList = this.dataMap.get(currentCtor);
      if (dataList !== undefined) {
        entries.push([currentCtor, createImmutableList(dataList)]);
      }

      currentCtor = Object.getPrototypeOf(currentCtor);
    }

    return createImmutableMap(entries);
  }

  getDecorator(): (...args: A) => ClassDecorator {
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
