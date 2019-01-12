export function generatorFrom<T>(iterable: Iterable<T>): () => IterableIterator<T> {
  return function *(): IterableIterator<T> {
    for (const item of iterable) {
      yield item;
    }
  };
}
