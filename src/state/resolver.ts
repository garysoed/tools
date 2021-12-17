import {Observable, OperatorFunction, pipe} from 'rxjs';
import {map, switchMap, tap, withLatestFrom} from 'rxjs/operators';

import {MutableState} from './mutable-state';


export interface ImmutableResolver<T> extends Observable<T> {
  _<K extends keyof T>(key: K): ImmutableResolver<T[K]>;
  $<K extends keyof MutableStatesOf<T>>(key: K): MutableResolver<MutableStatesOf<T>[K]>;
}

export class ImmutableResolverInternal<T> extends Observable<T> implements ImmutableResolver<T> {
  constructor(
    private readonly source$: Observable<T>,
  ) {
    super(subscriber => {
      return source$.subscribe(subscriber);
    });
  }

  _<K extends keyof T>(key: K): ImmutableResolver<T[K]> {
    return new ImmutableResolverInternal(this.source$.pipe(map(value => value[key])));
  }

  $<K extends keyof MutableStatesOf<T>>(key: K): MutableResolver<MutableStatesOf<T>[K]> {
    const subSelf$ = this.source$.pipe(
        map(value => {
          const mutableState = value[key];
          return mutableState as unknown as MutableState<MutableStatesOf<T>[K]>;
        }),
    );
    return new MutableResolverInternal(subSelf$);
  }
}

export interface MutableResolver<T> extends ImmutableResolver<T> {
  set(): OperatorFunction<T, unknown>;
}

export class MutableResolverInternal<T> extends ImmutableResolverInternal<T> implements MutableResolver<T> {
  constructor(
      private readonly mutableSource$: Observable<MutableState<T>>,
  ) {
    super(mutableSource$.pipe(switchMap(mutable => mutable.value$)));
  }

  set(): OperatorFunction<T, unknown> {
    return pipe(
        withLatestFrom(this.mutableSource$),
        tap(([value, mutable]) => {
          if (!mutable) {
            return;
          }

          mutable.set(value);
        }),
    );
  }
}


export type MutableStatesOf<T> = {
  readonly [K in keyof T]: T[K] extends MutableState<infer S> ? S : never;
};