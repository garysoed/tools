import { ArgMetaData } from './arg-meta-data';
import { PipeUtil } from './pipe-util';


/**
 * Annotates a parameter to indicate that the parameter has an external dependency.
 *
 * @param key The key identifying the external dependency.
 * @return The parameter decorator.
 */
export function External(key: string): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    PipeUtil.addArgument(
        target,
        propertyKey,
        parameterIndex,
        ArgMetaData.newInstance(key, {}, true));
  };
}
