import { stringify, Verbosity } from 'moirai/export';
import { MonoTypeOperatorFunction } from 'rxjs';
import { tap } from 'rxjs/operators';

export function debug<T>(key: string): MonoTypeOperatorFunction<T> {
  return tap(
      v => console.log(`[${key}] … ${stringify(v, Verbosity.DEBUG)}`),
      e => console.log(`[${key}] ✖ ${stringify(e, Verbosity.DEBUG)}`),
      () => console.log(`[${key}] ✔`),
  );
}
