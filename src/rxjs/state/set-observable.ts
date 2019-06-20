import { Observable } from '@rxjs';
import { scan } from '@rxjs/operators';

export interface SetAdd<T> {
  type: 'add';
  value: T;
}

export interface SetInit<T> {
  type: 'init';
  value: Set<T>;
}

export interface SetDelete<T> {
  type: 'delete';
  value: T;
}

export type SetDiff<T> = SetInit<T>|SetDelete<T>|SetAdd<T>;

export function scanSet<T>(): (obs: Observable<SetDiff<T>>) => Observable<Set<T>> {
  return source => source
      .pipe(
          scan<SetDiff<T>, Set<T>>(
              (acc, diff) => {
                switch (diff.type) {
                  case 'add':
                    return new Set([...acc, diff.value]);
                  case 'init':
                    return new Set(diff.value);
                  case 'delete':
                    return new Set([...acc].filter(v => v !== diff.value));
                }
              },
              new Set(),
          ),
      );
}
