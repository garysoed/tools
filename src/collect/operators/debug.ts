import { createGeneratorOperatorCopyAll } from '../create-operator';
import { GeneratorOperator } from '../types/operator';

/**
 * Prints out every element emitted by the Stream.
 * @param tag Prefix to tag the debug message.
 * @param toStringFn Custom function to convert the value to a string.
 */
export function debug<T extends Object, K>(
    tag: string,
    toStringFn: (value: T) => string = value => value.toString(),
): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    const generator = function *(): IterableIterator<T> {
      for (const item of from()) {
        console.debug(`${tag}: ${toStringFn(item)}`);

        yield item;
      }
    };

    return generator;
  });
}
