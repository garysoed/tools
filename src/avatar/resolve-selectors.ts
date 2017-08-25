import { Selector, SelectorStub } from '../avatar/selector';

function resolveSelectorsHelper_<T extends {}>(current: T, root: {}): T {
  const processed: T = {} as T;
  for (const key in current) {
    const value = current[key];
    if (value instanceof Selector) {
      if (value instanceof SelectorStub) {
        processed[key] = value.resolve(root);
      } else {
        processed[key] = value;
      }

      continue;
    }

    if (value instanceof Object) {
      processed[key] = resolveSelectorsHelper_(value, root);
    } else {
      processed[key] = value;
    }
  }

  return processed;
}

export function resolveSelectors<T extends {}>(raw: T): T {
  return resolveSelectorsHelper_(raw, raw);
}
