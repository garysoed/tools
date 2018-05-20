import { Log } from '../util/log';

export function deprecated(log: Log, message: string): MethodDecorator {
  return (
      _: Object,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
    const origValue = descriptor.value;
    descriptor.value = function(...args: any[]): any {
      Log.warn(log, propertyKey.toString(), 'is deprecated:', message);

      // tslint:disable-next-line:no-invalid-this
      return origValue.apply(this, args);
    };

    return descriptor;
  };
}
