import { IType } from '../check';

export class InstanceId<T, C> {
  constructor(
      private readonly debug_: string,
      private readonly type_: IType<T>,
      private readonly ctor_: gs.ICtor<C>) { }

  getConstructor(): gs.ICtor<C> {
    return this.ctor_;
  }

  getType(): IType<T> {
    return this.type_;
  }

  toString(): string {
    return `InstanceId(${this.debug_}, ${this.ctor_.name})`;
  }
}

export function instanceId<T, C>(
    debug: string, type: IType<T>, ctor: gs.ICtor<C>): InstanceId<T, C> {
  return new InstanceId(debug, type, ctor);
}
