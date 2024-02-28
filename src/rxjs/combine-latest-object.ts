import {combineLatest, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

type ObservableValues<O> = {
  readonly [K in keyof O]: Observable<O[K]>;
};

type UnknownValues<O> = {
  [K in keyof O]: unknown;
};

export function combineLatestObject<O>(
  fromObj: ObservableValues<O>,
): Observable<O> {
  const entries: Array<Observable<readonly [keyof O, unknown]>> = [];
  for (const key in fromObj) {
    const value$ = fromObj[key];
    entries.push(value$.pipe(map((value) => [key, value] as const)));
  }

  return (entries.length <= 0 ? of([]) : combineLatest(entries)).pipe(
    map((entries) => {
      const partial: Partial<UnknownValues<O>> = {};
      for (const [key, value] of entries) {
        partial[key] = value;
      }
      return partial as O;
    }),
  );
}
