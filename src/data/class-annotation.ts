import { ImmutableList } from '../immutable/immutable-list';

interface AnnotationResult<D, TF extends Function> {
  data: D;
  newTarget: TF|void;
}

type Annotator<A extends any[], D> =
    <TF extends Function>(target: TF, ...args: A) => AnnotationResult<D, TF>;

export class ClassAnnotation<D, A extends any[]> {
  private readonly dataMap: Map<Function, D> = new Map<Function, D>();

  constructor(
      private readonly annotator: Annotator<A, D>,
  ) { }

  getAttachedValues(ctorFn: Function): ImmutableList<[Function, D]> {
    const entries: Array<[Function, D]> = [];
    let currentCtor = ctorFn;
    while (currentCtor !== null) {
      const data = this.dataMap.get(currentCtor);
      if (data !== undefined) {
        entries.push([currentCtor, data]);
      }

      currentCtor = Object.getPrototypeOf(currentCtor);
    }

    return ImmutableList.of(entries);
  }

  getDecorator(): (...args: A) => ClassDecorator {
    return (...args: A) => {
      return <TF extends Function>(target: TF) => {
        const {data, newTarget} = this.annotator(target, ...args);
        this.dataMap.set(target, data);

        return newTarget;
      };
    };
  }
}
