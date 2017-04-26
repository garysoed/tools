import { Arrays } from '../collection/arrays';
import { Maps } from '../collection/maps';
import { ArgMetaData } from '../pipeline/arg-meta-data';
import { PipeUtil } from '../pipeline/pipe-util';


/**
 * Entry point for running graph nodes.
 */
export class Graph {
  /**
   * @param argMetaData The metadata for the given argument to resolve.
   * @param context The context within which the argument should be resolved.
   * @param externalArgs A mapping from key to value for resolving external arguments.
   */
  private static resolveArgument_<T>(
      argMetaData: ArgMetaData,
      context: any,
      externalArgs: {[key: string]: any}): T {
    const argKey = argMetaData.getKey();
    if (argMetaData.isExternal()) {
      // Use external value.
      const externalValue = externalArgs[argKey];
      if (externalValue === undefined) {
        throw new Error(`Cannot resolve external argument ${argKey}`);
      }
      return externalValue;
    } else {
      // Use other pipes.
      const forwardedArgs = Maps.fromRecord(argMetaData.getForwardedArguments())
          .mapValue((forwardedArgKey: string) => {
            const forwardedValue = externalArgs[forwardedArgKey];
            if (forwardedValue === undefined) {
              throw new Error((`Cannot resolve forwarded argument ${forwardedArgKey}`));
            }
            return forwardedValue;
          })
          .asRecord();
      return Graph.run<T>(context, argKey, forwardedArgs);
    }
  }

  /**
   * Runs the given node.
   * @param context The context of the node to run.
   * @param key The key referencing the node to run.
   * @param externalArgs A mapping of key to value for resolving external arguments.
   */
  static run<T>(context: any, key: string, opt_externalArgs: {[key: string]: any} = {}): T {
    const graphNode = PipeUtil.getNode<T>(context.constructor.prototype, key);
    if (graphNode === null) {
      throw new Error(`No nodes found for key "${key}" at object ${context}`);
    }

    const args = Arrays.of(graphNode.getArgs())
        .map((argData: ArgMetaData) => {
          return Graph.resolveArgument_(argData, context, opt_externalArgs);
        })
        .asArray();

    return graphNode!.run(context, args);
  }
}

