import { Type } from '../check/type';

export function AnyType<T>(): Type<T> {
  return {
    check(_: any): _ is T {
      return true;
    },

    toString(): string {
      return '(any)';
    },
  };
}
