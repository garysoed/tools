import { stringify, Verbosity } from 'moirai';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Logger } from 'santa';

const SUBSCRIBED_KEYS = new Set<string>();

export function debug<T>(
    logger: Logger,
    ...keys: string[]): MonoTypeOperatorFunction<T>;
export function debug<T>(
    logger: Logger,
    verbosity: Verbosity,
    ...keys: string[]): MonoTypeOperatorFunction<T>;
export function debug<T>(
    logger: Logger,
    verbosityOrKey: Verbosity|string,
    ...keys: string[]): MonoTypeOperatorFunction<T> {
  const verbosity = typeof verbosityOrKey === 'number' ? verbosityOrKey : 10;
  const normalizedKeys = typeof verbosityOrKey === 'number' ? keys : [verbosityOrKey, ...keys];
  const baseKey = normalizedKeys.join('::');

  return source => new Observable(subscriber => {
    const key = generateKey(baseKey);
    SUBSCRIBED_KEYS.add(key);
    logger.debug(`[${key}] ●`);
    source.pipe(
        tap(
            v => logger.debug(`[${key}] | ${stringify(v, verbosity)}`),
            e => logger.debug(`[${key}] ✖ ${stringify(e, verbosity)}`),
            () => logger.debug(`[${key}] -`),
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
