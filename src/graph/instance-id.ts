import { Type } from '../check';

export class InstanceId<T> {
  constructor(
      private readonly debug_: string,
      private readonly type_: Type<T>) { }

  getType(): Type<T> {
    return this.type_;
  }

  toString(): string {
    return `InstanceId(${this.debug_})`;
  }
}

export function instanceId<T>(debug: string, type: Type<T>): InstanceId<T> {
  return new InstanceId(debug, type);
}
