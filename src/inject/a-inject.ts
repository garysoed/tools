import Checks from '../checks';
import Injector from './injector';


/**
 * Marks the given constructor or function parameter as injectable.
 *
 * This accepts an optional name. If given, the parameter will be assigned to a value bound to that
 * name. Otherwise, the class will use the parameter's name. Due to possible class renaming done by
 * the compiler, it is suggested to always explicitly specify the name.
 *
 * @param name Name of the bound value to assign to this parameter.
 */
function Inject(name: string = null): ParameterDecorator {
  return function(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    let bindKey = name || propertyKey;

    if (Checks.isCtor(target)) {
      Injector.registerInject(bindKey, target, parameterIndex);
    } else {
      throw Error(`Target ${target} is not a constructor`);
    }
  };
}

export default Inject;
