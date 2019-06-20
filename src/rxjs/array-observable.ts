import { Observable } from '@rxjs';
import { map, scan } from '@rxjs/operators';

export interface ArrayInit<T> {
  type: 'init';
  value: T[];
}

export interface ArrayInsert<T> {
  index: number;
  type: 'insert';
  value: T;
}

export interface ArrayDelete {
  index: number;
  type: 'delete';
}

export interface ArraySet<T> {
  index: number;
  type: 'set';
  value: T;
}

export type ArrayDiff<T> = ArrayInit<T>|ArrayInsert<T>|ArrayDelete|ArraySet<T>;

export interface ArrayObservable<T> {
  getDiffs(): Observable<ArrayDiff<T>>;
}

export function mapArray<F, T>(mapFn: (from: F) => T):
    (obs: Observable<ArrayDiff<F>>) => Observable<ArrayDiff<T>> {
  return source => source
      .pipe(
          map(diff => {
            switch (diff.type) {
              case 'delete':
                return {
                  index: diff.index,
                  type: 'delete',
                };
              case 'init':
                return {
                  type: 'init',
                  value: diff.value.map(mapFn),
                };
              case 'insert':
                return {
                  index: diff.index,
                  type: 'insert',
                  value: mapFn(diff.value),
                };
              case 'set':
                return {
                  index: diff.index,
                  type: 'set',
                  value: mapFn(diff.value),
                };
            }
          }),
      );
}

export function scanArray<T>(): (obs: Observable<ArrayDiff<T>>) => Observable<T[]> {
  return source => source
      .pipe(
          scan<ArrayDiff<T>, T[]>(
              (acc, diff) => {
                const copy = [...acc];
                switch (diff.type) {
                  case 'delete':
                    copy.splice(diff.index, 1);

                    return copy;
                  case 'init':
                    return [...diff.value];
                  case 'insert':
                    copy.splice(diff.index, 0, diff.value);

                    return copy;
                  case 'set':
                    copy[diff.index] = diff.value;

                    return copy;
                }
              },
              [],
          ),
      );
}
