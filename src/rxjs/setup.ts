import { merge, Observable } from 'rxjs';

const __keys = Symbol('keys');

interface Target extends Object {
  [__keys]?: Set<string|symbol>;
}

function getSetupKeys(target: Target): ReadonlySet<string|symbol> {
  return target[__keys] || new Set();
}

function addSetupKey(target: Target, key: string|symbol): void {
  const keys = target[__keys] || new Set();
  keys.add(key);
  target[__keys] = keys;
}

export function setup(): PropertyDecorator {
  return (
      target: Object,
      propertyKey: string|symbol,
  ): void => {
    addSetupKey(target, propertyKey);
  };
}

export function runSetup(target: any): Observable<unknown> {
  const obs$ = [...getSetupKeys(target)].map(key => {
    const value = target[key];
    if (!(value instanceof Observable)) {
      throw new Error(`Key ${key.toString()} is not an Observable`);
    }

    return value;
  });

  return merge(...obs$);
}
