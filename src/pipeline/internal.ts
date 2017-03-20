import { ArgMetaData } from './arg-meta-data';
import { PipeUtil } from './pipe-util';


/**
 * Annotates a parameter indicating that this is an internal dependency, from another graph node.
 * @param key The key of the Pipe that this should get the value from.
 * @param opt_forwardedArguments Mapping of external arguments that should be forwarded to the
 *    dependency pipe. The key is the name of the external argument in the dependency, while the
 *    value is the name of the external argument in the current pipe.
 */
export function Internal(
    key: string,
    opt_forwardedArguments: {[key: string]: any} = {}): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    PipeUtil.addArgument(
        target,
        propertyKey,
        parameterIndex,
        ArgMetaData.newInstance(key, opt_forwardedArguments, false));
  };
}
