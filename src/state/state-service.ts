import {BehaviorSubject, Observable, of} from 'rxjs';
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators';

import {BaseIdGenerator} from '../random/idgenerators/base-id-generator';
import {SimpleIdGenerator} from '../random/idgenerators/simple-id-generator';

import {MutableState} from './mutable-state';
import {createObjectPath, IMMUTABLE_PATH_PREFIX, isObjectPath, MUTABLE_PATH_PREFIX, ObjectPath} from './object-path';
import {ImmutableResolver, ImmutableResolverInternal, MutableResolver, MutableResolverInternal} from './resolver';
import {createRootStateId, RootStateId} from './root-state-id';


type InputOf<T> = Observable<T>|T;

export type PathProvider<F, T> = (root: ImmutableResolver<F>) => ImmutableResolver<T>;

/**
 * Manages global states.
 *
 * @remarks
 * Every object added must be immutable. Any mutable values must be added as a separate entry.
 *
 * @thModule state
 */
export class StateService {
  private readonly objectPaths$ = new BehaviorSubject<ReadonlyMap<string, ImmutableResolver<unknown>>>(new Map());
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

  immutablePath<T>(root: InputOf<RootStateId<T>>): ObjectPath<T>;
  immutablePath<T, R>(root: InputOf<RootStateId<R>>, provider: PathProvider<R, T>): ObjectPath<T>;
  immutablePath(root: InputOf<RootStateId<unknown>>, provider?: PathProvider<unknown, unknown>): ObjectPath<unknown> {
    const id = `${IMMUTABLE_PATH_PREFIX}::${this.idGenerator.generate(new Set(this.objectPaths$.getValue().keys()))}`;
    return this.objectPath(id, root, provider);
  }

  mutablePath<T>(root: InputOf<RootStateId<MutableState<T>>>): ObjectPath<MutableState<T>>;
  mutablePath<T, R>(root: InputOf<RootStateId<R>>, provider: PathProvider<R, MutableState<T>>): ObjectPath<MutableState<T>>;
  mutablePath(root: InputOf<RootStateId<unknown>>, provider?: PathProvider<unknown, MutableState<unknown>>): ObjectPath<MutableState<unknown>> {
    const baseId = this.idGenerator.generate(new Set(this.objectPaths$.getValue().keys()));
    const immutableId = `${IMMUTABLE_PATH_PREFIX}::${baseId}`;
    this.objectPath(
        immutableId,
        root,
        root => {
          const resolver = provider ? provider(root) : root as ImmutableResolver<MutableState<unknown>>;
          return new ImmutableResolverInternal(
              resolver.pipe(
                  switchMap(resolver => resolver?.value$ ?? of(undefined)),
              ),
          );
        });

    const mutableId = `${MUTABLE_PATH_PREFIX}::${baseId}`;
    return this.objectPath(mutableId, root, provider);
  }

  private objectPath<T>(
      id: string,
      root: InputOf<RootStateId<unknown>>,
      provider?: PathProvider<unknown, T>,
  ): ObjectPath<T> {
    const path = provider ? provider(this._(root)) : this._(root);

    const resultMap = new Map(this.objectPaths$.getValue());
    resultMap.set(id, path);
    this.objectPaths$.next(resultMap);
    return createObjectPath(id);
  }

  _<T>(id: InputOf<RootStateId<T>>|InputOf<ObjectPath<T>>): ImmutableResolver<T> {
    return new ImmutableResolverInternal<T>(
        normalizeInputOf(id).pipe(
            switchMap(idOrPath => {
              if (!idOrPath) {
                return of(undefined);
              }

              if (isObjectPath(idOrPath)) {
                return this.objectPaths$.pipe(
                    switchMap(mutablePaths => {
                      if (!mutablePaths) {
                        return of(undefined);
                      }

                      return mutablePaths.get(idOrPath.id) as Observable<T>;
                    }),
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

  $<T>(id: InputOf<RootStateId<MutableState<T>>>|InputOf<ObjectPath<MutableState<T>>>): MutableResolver<T> {
    const rv = new MutableResolverInternal<T>(
        normalizeInputOf(id).pipe(
            switchMap(idOrPath => {
              if (!idOrPath) {
                return of(undefined);
              }

              if (isObjectPath(idOrPath)) {
                return this.objectPaths$.pipe(
                    switchMap(mutablePaths => {
                      if (!mutablePaths) {
                        return of(undefined);
                      }

                      return mutablePaths.get(idOrPath.id) as Observable<MutableState<T>>;
                    }),
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

