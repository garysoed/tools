import { CtorType } from '../check/ctor-type';
import { InstanceofType } from '../check/instanceof-type';
import { InjectMetadata } from '../inject/inject-metadata';
import { InjectUtil } from '../inject/inject-util';


export function inject(name: (string|null) = null, defaultValue?: any): ParameterDecorator {
  return function(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    if (CtorType().check(target)) {
      const bindKey = name || propertyKey;
      const metadata = InjectUtil.getMetadataMap(target);
      metadata.set(parameterIndex, InjectMetadata.newInstance(bindKey, defaultValue));
    } else {
      throw Error(`Target ${target} is not a constructor`);
    }
  };
}
