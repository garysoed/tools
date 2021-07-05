import {Type} from 'gs-types';
import {BehaviorSubject, Observable, of, OperatorFunction, pipe} from 'rxjs';
import {distinctUntilChanged, map, switchMap, withLatestFrom, tap} from 'rxjs/operators';

import {BaseIdGenerator} from '../random/idgenerators/base-id-generator';
import {SimpleIdGenerator} from '../random/idgenerators/simple-id-generator';


const __unusedRootStateId = Symbol('unusedRootStateId');

export interface RootStateId<T> {
  readonly [__unusedRootStateId]: Type<T>;
  readonly id: string;
}

export function createRootStateId<T>(innerValue: string): RootStateId<T> {
  return {id: innerValue, [__unusedRootStateId]: {} as any};
}

type InputOf<T> = Observable<T|null|undefined>|T|null|undefined;

export interface MutableState<T> {
  value$: Observable<T>;
  set(newValue: T): void;
}

type MutableStatesOf<T> = {
  readonly [K in keyof T]: T[K] extends MutableState<infer S> ? S : never;
};

/**
 * Used to resolve properties of the given ID.
 *
 * @typeParam T - Object to be resolved.
 */
export interface Resolver2<T> extends Observable<T|undefined> {
  _<K extends keyof T>(key: K): Resolver2<T[K]>;
  $get<K extends keyof MutableStatesOf<T>>(key: K): Resolver2<MutableStatesOf<T>[K]>;
  $set<K extends keyof MutableStatesOf<T>>(key: K): OperatorFunction<MutableStatesOf<T>[K], unknown>;
}

class ResolverInternal<T> extends Observable<T|undefined> implements Resolver2<T> {
  constructor(
      private readonly source$: Observable<T|undefined>,
  ) {
    super(subscriber => {
      return source$.subscribe(subscriber);
    });
  }

  _<K extends keyof T>(key: K): Resolver2<T[K]> {
    return new ResolverInternal(this.source$.pipe(map(value => value?.[key])));
  }

  $get<K extends keyof MutableStatesOf<T>>(key: K): Resolver2<MutableStatesOf<T>[K]> {
    const subSelf$ = this.source$.pipe(
        map(value => value?.[key] as MutableState<MutableStatesOf<T>[K]>|undefined),
        switchMap(mutableState => {
          if (mutableState === undefined) {
            return of(undefined);
          }

          return mutableState.value$;
        }),
    );
    return new ResolverInternal(subSelf$);
  }

  $set<K extends keyof MutableStatesOf<T>>(key: K): OperatorFunction<MutableStatesOf<T>[K], unknown> {
    return pipe(
        withLatestFrom(this._(key)),
        tap(([value, mutable]) => {
          if (!mutable) {
            return;
          }

          (mutable as unknown as MutableState<unknown>).set(value);
        }),
    );
  }
}

const __unusedObjectPath = Symbol('unusedObjectPath');

export interface ObjectPath<T> {
  readonly id: string;
  readonly [__unusedObjectPath]: Type<T>;
}

function createObjectPath<T>(innerValue: string): ObjectPath<T> {
  return {id: innerValue, [__unusedObjectPath]: {} as any};
}

export function mutableState<T>(value: T): MutableState<T> {
  const value$ = new BehaviorSubject(value);
  return {
    value$,
    set(value: T): void {
      value$.next(value);
    },
  };
}

type PathProvider<R, T> = (root: Resolver2<R>) => Resolver2<T>;

export class StateService2 {
  private readonly objectPaths$ = new BehaviorSubject<ReadonlyMap<string, Resolver2<any>>>(new Map());
  private readonly rootStates$ = new BehaviorSubject<ReadonlyMap<string, any>>(new Map());

  constructor(private readonly idGenerator: BaseIdGenerator = new SimpleIdGenerator()) {}

  addRoot<T>(value: T): RootStateId<T> {
    const id = this.idGenerator.generate(new Set(this.rootStates$.getValue().keys()));
    const stateId = createRootStateId<T>(id);

    const resultMap = new Map(this.rootStates$.getValue());
    resultMap.set(stateId.id, value);
    this.rootStates$.next(resultMap);
    return stateId;
  }

  objectPath<T, R>(
      root: InputOf<RootStateId<R>>,
      provider: PathProvider<R, T>,
  ): ObjectPath<T> {
    const id = this.idGenerator.generate(new Set(this.objectPaths$.getValue().keys()));
    const path = provider(this.resolve(root));

    const resultMap = new Map(this.rootStates$.getValue());
    resultMap.set(id, path);
    this.objectPaths$.next(resultMap);
    return createObjectPath(id);
  }

  resolve<T>(id: InputOf<RootStateId<T>|ObjectPath<T>>): Resolver2<T> {
    return new ResolverInternal<T>(
        normalizeInputOf(id).pipe(
            switchMap(idOrPath => {
              if (!idOrPath) {
                return of(undefined);
              }

              if (isObjectPath(idOrPath)) {
                return this.objectPaths$.pipe(
                    switchMap(objectPaths => objectPaths.get(idOrPath.id) ?? of(undefined)),
                    distinctUntilChanged(),
                );
              }

              return this.rootStates$.pipe(
                  map(rootStates => rootStates.get(idOrPath.id)),
                  distinctUntilChanged(),
              );
            }),
        ),
    );
  }
}

function normalizeInputOf<T>(input: InputOf<T>): Observable<T|undefined> {
  if (!input) {
    return of(undefined);
  }

  if (!(input instanceof Observable)) {
    return of(input);
  }

  return input.pipe(switchMap(inner => normalizeInputOf(inner)));
}

function isObjectPath<T>(target: Partial<ObjectPath<T>>): target is ObjectPath<T> {
  return !!target[__unusedObjectPath];
}