import {Checks} from '../util/checks';


/**
 * @hidden
 */
const METADATA_ = Symbol('metadata');


interface IInject {
  /**
   * Marks the given constructor or function parameter as injectable.
   *
   * This accepts an optional name. If given, the parameter will be assigned to a value bound to
   * that name. Otherwise, the class will use the parameter's name. Due to possible class renaming
   * done by the compiler, it is suggested to always explicitly specify the name.
   *
   * @param name Name of the bound value to assign to this parameter.
   */
  (name?: string): ParameterDecorator;

  /**
   * Gets all binding metadata for the given constructor.
   *
   * @param ctor The constructor whose metadata should be returned.
   * @return Map of binding metadata for the given constructor. The key is the parameter index. The
   *    value is the binding key for that parameter index.
   */
  getMetadata(ctor: gs.ICtor<any>): Map<number, string | symbol>;
}


const Inject: IInject = <any> function(name: string = null): ParameterDecorator {
  return function(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    if (Checks.isCtor(target)) {
      let bindKey = name || propertyKey;
      let metadata = Inject.getMetadata(target);
      metadata.set(parameterIndex, bindKey);
    } else {
      throw Error(`Target ${target} is not a constructor`);
    }
  };
};

Inject.getMetadata = function(ctor: gs.ICtor<any>): Map<number, string | symbol> {
  if (ctor[METADATA_] === undefined) {
    ctor[METADATA_] = new Map<number, string | symbol>();
  }
  return ctor[METADATA_];
};

export default Inject;
