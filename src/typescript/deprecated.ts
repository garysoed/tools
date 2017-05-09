import { Log } from '../util/log';

export function deprecated(log: Log, message: string): MethodDecorator {
  return function(
      target: Object,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
    const origValue = descriptor.value;
    descriptor.value = function(...args: any[]): any {
      Log.warn(log, message);
      return origValue.apply(this, args);
    };
    return descriptor;
  };
}
// TODO: Mutable
