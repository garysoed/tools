import { Type } from '../check';

export class StaticId<T> {
  constructor(
      private readonly debug_: string,
      private readonly type_: Type<T>) { }

  getType(): Type<T> {
    return this.type_;
  }

  toString(): string {
    return `StaticId(${this.debug_})`;
  }
}

export function staticId<T>(debug: string, type: Type<T>): StaticId<T> {
  return new StaticId(debug, type);
}
