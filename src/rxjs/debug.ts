import {MonoTypeOperatorFunction, Observable} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';
import {Logger} from 'santa';

const SUBSCRIBED_KEYS = new Set<string>();

const DEFAULT_LOGGER = {
  debug(...parts: unknown[]): void {
    // eslint-disable-next-line no-console
    console.debug(...parts);
  },
};

export function debug<T>(
  loggerIn: Logger | null,
  ...keys: string[]
): MonoTypeOperatorFunction<T> {
  const baseKey = keys.join('::');
  const logger = loggerIn ?? DEFAULT_LOGGER;

  return (source) =>
    new Observable((subscriber) => {
      const key = generateKey(baseKey);
      SUBSCRIBED_KEYS.add(key);
      logger.debug(`[${key}] ●`);
      source
        .pipe(
          tap(
            (v) => logger.debug(`[${key}]`, '|', v),
            (e) => logger.debug(`[${key}]`, '✖', e),
            () => logger.debug(`[${key}]`, '-'),
          ),
          finalize(() => SUBSCRIBED_KEYS.delete(key)),
        )
        .subscribe(subscriber);
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
