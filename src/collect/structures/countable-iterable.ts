export function countableIterable(): Iterable<number> {
  return (function*(): Generator<number> {
    let i = 0;
    while (true) {
      yield i;
      i++;
    }
  })();
}
