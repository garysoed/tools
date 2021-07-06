import {BehaviorSubject, Observable, of} from 'rxjs';
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators';

import {BaseIdGenerator} from '../random/idgenerators/base-id-generator';
import {SimpleIdGenerator} from '../random/idgenerators/simple-id-generator';

import {createMutablePath, isMutablePath, MutablePath, PathProvider} from './mutable-path';
import {MutableState} from './mutable-state';
import {ImmutableResolver, ImmutableResolverInternal, MutableResolver, MutableResolverInternal} from './resolver';
import {createRootStateId, RootStateId} from './root-state-id';


type InputOf<T> = Observable<T|null|undefined>|T|null|undefined;

/**
 * Manages global states.
 *
 * @remarks
 * Every object added must be immutable. Any mutable values must be added as a separate entry.
 *
 * @thModule state
 */
export class StateService {
  private readonly mutablePaths$ = new BehaviorSubject<ReadonlyMap<string, ImmutableResolver<MutableState<any>>>>(new Map());
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

  mutablePath<T>(root: InputOf<RootStateId<MutableState<T>>>): MutablePath<T>;
  mutablePath<T, R>(root: InputOf<RootStateId<R>>, provider: PathProvider<R, T>): MutablePath<T>;
  mutablePath<T, R>(root: InputOf<RootStateId<R>>, provider?: PathProvider<R, T>): MutablePath<T> {
    const id = this.idGenerator.generate(new Set(this.mutablePaths$.getValue().keys()));
    const path = provider ? provider(this._(root)) : this._(root as unknown as RootStateId<MutableState<unknown>>);

    const resultMap = new Map(this.mutablePaths$.getValue());
    resultMap.set(id, path);
    this.mutablePaths$.next(resultMap);
    return createMutablePath(id);
  }

  _<T>(id: InputOf<RootStateId<T>>): ImmutableResolver<T> {
    return new ImmutableResolverInternal<T>(
        normalizeInputOf(id).pipe(
            switchMap(idOrPath => {
              if (!idOrPath) {
                return of(undefined);
              }

              if (isMutablePath(idOrPath)) {
                return this.mutablePaths$.pipe(
                    switchMap(mutablePaths => mutablePaths.get(idOrPath.id) ?? of(undefined)),
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

  $<T>(id: InputOf<RootStateId<MutableState<T>>|MutablePath<T>>): MutableResolver<T> {
    const rv = new MutableResolverInternal<T>(
        normalizeInputOf(id).pipe(
            switchMap(idOrPath => {
              if (!idOrPath) {
                return of(undefined);
              }

              if (isMutablePath(idOrPath)) {
                return this.mutablePaths$.pipe(
                    switchMap(mutablePaths => mutablePaths.get(idOrPath.id) ?? of(undefined)),
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

