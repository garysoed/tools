import {Operator} from '../../typescript/operator';

export function $buffer<T>(count: number): Operator<Iterable<T>, Iterable<readonly T[]>> {
  return (fromIterable: Iterable<T>) => {
    return (function*(): Generator<readonly T[]> {
      const buffer = [];
      for (const item of fromIterable) {
        buffer.push(item);
        if (buffer.length < count) {
          continue;
        }
        yield buffer.splice(0, buffer.length);
      }
    })();
  };
}