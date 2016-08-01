import {Checks} from '../util/checks';
import {InjectMetadata} from './inject-metadata';
import {InjectUtil} from './inject-util';


export function inject(name: (string|null) = null, defaultValue?: any): ParameterDecorator {
  return function(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    if (Checks.isCtor(target)) {
      let bindKey = name || propertyKey;
      let metadata = InjectUtil.getMetadataMap(target);
      metadata.set(parameterIndex, InjectMetadata.newInstance(bindKey, defaultValue));
    } else {
      throw Error(`Target ${target} is not a constructor`);
    }
  };
};
