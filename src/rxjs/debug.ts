import { stringify, Verbosity } from 'moirai';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

const SUBSCRIBED_KEYS = new Set<string>();

export function debug<T>(...keys: string[]): MonoTypeOperatorFunction<T> {
  const baseKey = keys.join('::');

  return source => new Observable(subscriber => {
    const key = generateKey(baseKey);
    SUBSCRIBED_KEYS.add(key);
    console.debug(`[${key}] ●`);
    source.pipe(
        tap(
            v => console.debug(`[${key}] | ${stringify(v, 10)}`),
            e => console.debug(`[${key}] ✖ ${stringify(e, 10)}`),
            () => console.debug(`[${key}] -`),
        ),
        finalize(() => SUBSCRIBED_KEYS.delete(key)),
    ).subscribe(subscriber);
  });
}

function generateKey(base: string): string {
  let i = 0;
  let attempt = base;
  while (SUBSCRIBED_KEYS.has(attempt)) {
    attempt = `${base}::${i}`;
    i++;
  }

  return attempt;
}
