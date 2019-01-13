import { copyMetadata } from '../generators';
import { TypedGenerator } from '../typed-generator';
import { GeneratorMapOperator } from './generator-map-operator';

export function filter<F, T extends F>(
    filterFn: (value: F) => value is T,
): GeneratorMapOperator<F, T>;
export function filter<T>(filterFn: (value: T) => boolean): GeneratorMapOperator<T, T>;
export function filter<T>(filterFn: (value: T) => boolean): any {
  return (from: TypedGenerator<T>) => {
    return copyMetadata(
        function *(): IterableIterator<T> {
          for (const value of from()) {
            if (filterFn(value)) {
              yield value;
            }
          }
        },
        from,
    );
  };
}
