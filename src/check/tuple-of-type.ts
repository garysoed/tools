import { Type } from '../check/type';

export function TupleOfType<T0>(spec: [Type<T0>]): Type<[T0]>;
export function TupleOfType<T0, T1>(spec: [Type<T0>, Type<T1>]): Type<[T0, T1]>;
export function TupleOfType(spec: Type<any>[]): Type<any[]> {
  return {
    check(target: any): target is any[] {
      if (!(target instanceof Object)) {
        return false;
      }

      return spec.every((type: Type<any>, index: number) => {
        return type.check(target[index]);
      });
    },

    toString(): string {
      return `[${spec.map((type: Type<any>) => `${type}`).join(', ')}]`;
    },
  };
}
