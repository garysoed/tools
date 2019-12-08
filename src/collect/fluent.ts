import { FluentIterable } from './fluent-iterable';

export function $<T>(source: Iterable<T>): FluentIterable<T> {
  return new FluentIterable(source);
}
