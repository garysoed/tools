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


interface ImmutableResolver<T> extends Observable<T|undefined> {
    _<K extends keyof T>(key: K): ImmutableResolver<T[K]>;
    $<K extends keyof MutableStatesOf<T>>(key: K): MutableResolver<MutableStatesOf<T>[K]>;
}

class ImmutableResolverInternal<T> extends Observable<T|undefined> implements ImmutableResolver<T> {
  constructor(
      private readonly source$: Observable<T|undefined>,
  ) {
    super(subscriber => {
      return source$.subscribe(subscriber);
    });
  }

  _<K extends keyof T>(key: K): ImmutableResolver<T[K]> {
    return new ImmutableResolverInternal(this.source$.pipe(map(value => value?.[key])));
  }

  $<K extends keyof MutableStatesOf<T>>(key: K): MutableResolver<MutableStatesOf<T>[K]> {
    const subSelf$ = this.source$.pipe(
        map(value => {
          const mutableState = value?.[key];
          if (mutableState === undefined) {
            return undefined;
          }

          return mutableState as unknown as MutableState<MutableStatesOf<T>[K]>;
        }),
    );
    return new MutableResolverInternal(subSelf$);
  }
}

interface MutableResolver<T> extends ImmutableResolver<T> {
  set(): OperatorFunction<T, unknown>;
}

class MutableResolverInternal<T> extends ImmutableResolverInternal<T> implements MutableResolver<T> {
  constructor(
      private readonly mutableSource$: Observable<MutableState<T>|undefined>,
  ) {
    super(mutableSource$.pipe(
        switchMap(mutable => mutable?.value$ ?? of(undefined)),
    ));
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


type Resolver<T> = T extends MutableState<infer V> ? MutableResolver<V> : ImmutableResolver<T>;


export type Resolver2<T> = Resolver<T>;

const __unusedObjectPath = Symbol('unusedObjectPath');

export interface ObjectPath<T> {
  readonly id: string;
  readonly [__unusedObjectPath]: Type<T>;
}

export function createObjectPath<T>(innerValue: string): ObjectPath<T> {
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

export type PathProvider<R, T> = (root: ImmutableResolver<R>) => ImmutableResolver<MutableState<T>>;

export class StateService2 {
  private readonly objectPaths$ = new BehaviorSubject<ReadonlyMap<string, ImmutableResolver<MutableState<any>>>>(new Map());
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

  mutablePath<T>(root: InputOf<RootStateId<MutableState<T>>>): ObjectPath<T>;
  mutablePath<T, R>(root: InputOf<RootStateId<R>>, provider: PathProvider<R, T>): ObjectPath<T>;
  mutablePath<T, R>(root: InputOf<RootStateId<R>>, provider?: PathProvider<R, T>): ObjectPath<T> {
    const id = this.idGenerator.generate(new Set(this.objectPaths$.getValue().keys()));
    const path = provider ? provider(this._(root)) : this._(root as unknown as RootStateId<MutableState<unknown>>);

    const resultMap = new Map(this.objectPaths$.getValue());
    resultMap.set(id, path);
    this.objectPaths$.next(resultMap);
    return createObjectPath(id);
  }

  _<T>(id: InputOf<RootStateId<T>>): ImmutableResolver<T> {
    return new ImmutableResolverInternal<T>(
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

  $<T>(id: InputOf<RootStateId<MutableState<T>>|ObjectPath<T>>): MutableResolver<T> {
    const rv = new MutableResolverInternal<T>(
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

    return rv;
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