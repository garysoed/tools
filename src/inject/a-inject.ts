import { AnyType } from 'gs-types/export';
import { InjectMetadata } from '../inject/inject-metadata';
import { InjectUtil } from '../inject/inject-util';


export function inject(name: (string|null) = null, isOptional?: boolean): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    // TODO: Make Ctor type
    if (AnyType<gs.ICtor<any>>().check(target)) {
      const bindKey = name || propertyKey;
      const metadata = InjectUtil.getMetadataMap(target);
      metadata.set(parameterIndex, InjectMetadata.newInstance(bindKey, isOptional));
    } else {
      throw Error(`Target ${target} is not a constructor`);
    }
  };
}
