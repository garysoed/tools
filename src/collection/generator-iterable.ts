/**
 * Iterable that uses the given generator function to generate its elements.
 *
 * @param <T> The type of element in the iterator.
 */
export class GeneratorIterable<T> implements Iterable<T> {
  private generatorFn_: () => IteratorResult<T>;

  constructor(generatorFn: () => IteratorResult<T>) {
    this.generatorFn_ = generatorFn;
  }

  [Symbol.iterator](): Iterator<T> {
    let generator = this.generatorFn_;
    return {
      next(): IteratorResult<T> {
        return generator();
      },
    };
  }

  /**
   * Creates a new instance of GeneratorIterable.
   *
   * @param generatorFn Function that generates the value of the iterable. The return value must be
   *    a JS Object with two properties: `done` is a `boolean` that is true iff there are no more
   *    elements to be generated. `value` is optional property that contains the element of the
   *    iterable.
   * @return New instance of GeneratorIterable.
   */
  static newInstance<T>(generatorFn: () => IteratorResult<T>): GeneratorIterable<T> {
    return new GeneratorIterable<T>(generatorFn);
  }
}
