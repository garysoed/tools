/**
 * Creates an infinite {@link Iterable} containing countable numbers (0, 1, 2, ...).
 *
 * @returns Infinite `Iterable` containing countable numbers.
 * @thModule collect.structures
 */
export function countableIterable(): Iterable<number> {
  return (function* (): Generator<number> {
    let i = 0;
    while (true) {
      yield i;
      i++;
    }
  })();
}
