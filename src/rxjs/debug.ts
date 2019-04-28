import { stringify, Verbosity } from '@moirai';
import { MonoTypeOperatorFunction } from '@rxjs';
import { tap } from '@rxjs/operators';

export function debug<T>(...keys: string[]): MonoTypeOperatorFunction<T> {
  const key = keys.join('::');
  return tap(
      v => console.debug(`[${key}] | ${stringify(v, Verbosity.DEBUG)}`),
      e => console.debug(`[${key}] ✖ ${stringify(e, Verbosity.DEBUG)}`),
      () => console.debug(`[${key}] -`),
  );
}
