import { IType } from '../check';

export class StaticId<T> {
  constructor(
      private readonly debug_: string,
      private readonly type_: IType<T>) { }

  getType(): IType<T> {
    return this.type_;
  }

  toString(): string {
    return `StaticId(${this.debug_})`;
  }
}

export function staticId<T>(debug: string, type: IType<T>): StaticId<T> {
  return new StaticId(debug, type);
}
