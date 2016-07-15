import {ArgMetaData} from './arg-meta-data';
import {Arrays} from '../collection/arrays';
import {Maps} from '../collection/maps';
import {PipeUtil} from './pipe-util';
import {Validate} from '../valid/validate';


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
    let argKey = argMetaData.key;
    if (argMetaData.isExternal) {
      // Use external value.
      let externalValue = externalArgs[argKey];
      Validate.any(externalValue).to.beDefined()
          .orThrows(`Cannot resolve external argument ${argKey}`)
          .assertValid();
      return externalValue;
    } else {
      let validations: {[key: string]: any} = {};

      // Use other pipes.
      let forwardedArgs = Maps.fromRecord(argMetaData.forwardedArguments)
          .mapValue((forwardedArgKey: string) => {
            let forwardedValue = externalArgs[forwardedArgKey];
            validations[forwardedArgKey] = Validate.any(forwardedValue)
                .to.beDefined()
                .orThrows(`Cannot resolve forwarded argument ${forwardedArgKey}`);
            return forwardedValue;
          })
          .asRecord();
      Validate.batch(validations).to.allBeValid().assertValid();
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
    let graphNode = PipeUtil.getNode<T>(context.constructor.prototype, key);
    Validate.any(graphNode).to.exist()
        .orThrows(`No nodes found for key "${key}" at object ${context}`)
        .assertValid();

    let args = Arrays.of(graphNode!.args)
        .map((argData: ArgMetaData) => {
          return Graph.resolveArgument_(argData, context, opt_externalArgs);
        })
        .asArray();

    return graphNode!.run(context, args);
  }
}

