import { IType } from '../check';

export class InstanceId<T> {
  constructor(
      private readonly debug_: string,
      private readonly type_: IType<T>) { }

  getType(): IType<T> {
    return this.type_;
  }

  toString(): string {
    return `InstanceId(${this.debug_})`;
  }
}

export function instanceId<T>(debug: string, type: IType<T>): InstanceId<T> {
  return new InstanceId(debug, type);
}
