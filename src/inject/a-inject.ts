import {Checks} from '../util/checks';
import {InjectUtil} from './inject-util';


export function Inject(name: (string|null) = null): ParameterDecorator {
  return function(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    if (Checks.isCtor(target)) {
      let bindKey = name || propertyKey;
      let metadata = InjectUtil.getMetadata(target);
      metadata.set(parameterIndex, bindKey);
    } else {
      throw Error(`Target ${target} is not a constructor`);
    }
  };
};
