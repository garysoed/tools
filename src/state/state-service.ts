import {BehaviorSubject, EMPTY, Observable, of as observableOf} from 'rxjs';
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators';

import {asArray as $asArray} from '../collect/operators/as-array';
import {asMap as $asMap} from '../collect/operators/as-map';
import {asSet as $asSet} from '../collect/operators/as-set';
import {map as $map} from '../collect/operators/map';
import {$pipe} from '../collect/operators/pipe';
import {cache} from '../data/cache';
import {BaseIdGenerator} from '../random/base-id-generator';
import {SimpleIdGenerator} from '../random/simple-id-generator';
import {diffMap} from '../rxjs/state/map-diff';

import {Snapshot} from './snapshot';
import {StateId, createId} from './state-id';

type StateIdOf<T> = {
  readonly [K in keyof T]: T[K] extends StateId<infer S> ? S : never;
};


/**
 * Used to resolve properties of the given ID.
 *
 * @typeParam T - Object to be resolved.
 */
export interface Resolver<T> {
  readonly self$: Observable<T|undefined>;
  _<K extends keyof T>(key: K): Observable<T[K]|undefined>;
  $<K extends keyof StateIdOf<T>>(key: K): Resolver<StateIdOf<T>[K]>;
}

/**
 * Manages global states.
 *
 * @remarks
 * Every object added must be immutable. Any mutable values must be added as a separate entry.
 *
 * @thModule state
 */
export class StateService {
  private readonly payloads$ = new BehaviorSubject<ReadonlyMap<string, any>>(new Map());

  constructor(private readonly idGenerator: BaseIdGenerator = new SimpleIdGenerator()) {}

  private createResolver<T>(self$: Observable<T|undefined>): Resolver<T> {
    return {
      self$,
      _: <K extends keyof T>(key: K): Observable<T[K]|undefined> => {
        return self$.pipe(map(value => value?.[key]));
      },
      $: <K extends keyof StateIdOf<T>>(key: K): Resolver<StateIdOf<T>[K]> => {
        const subSelf$ = self$.pipe(
            map(value => value?.[key] as StateId<StateIdOf<T>[K]>|undefined),
            switchMap(stateId => {
              if (stateId === undefined) {
                return observableOf(undefined);
              }

              return this.getValue(stateId);
            }),
        );
        return this.createResolver(subSelf$);
      },
    };
  }

  private getValue<T>({id}: StateId<T>): Observable<T|undefined> {
    return this.payloads$.pipe(
        map(payloads => payloads.get(id)),
        distinctUntilChanged(),
    );
  }


  /**
   * Adds the given value to the global state.
   *
   * @typeParam T - Type of the object added.
   * @param value - Value to be added.
   * @returns ID associated with the given value.
   */
  add<T>(value: T): StateId<T> {
    const existingMap = new Map(this.payloads$.getValue());
    const existingIdValues = $pipe(
        existingMap.keys(),
        $asSet(),
    );

    const newIdValue = this.idGenerator.generate(existingIdValues);
    existingMap.set(newIdValue, value);
    this.payloads$.next(existingMap);

    return createId(newIdValue);
  }

  /**
   * Removes all added entries.
   */
  clear(): void {
    this.payloads$.next(new Map());
  }

  /**
   * Deletes the given ID from the global state.
   *
   * @typeParams T = Type of the value to be deleted.
   * @param id - ID of the value to be deleted.
   * @returns True iff the ID existed in the global state.
   */
  delete<T>({id}: StateId<T>): boolean {
    const existingMap = new Map(this.payloads$.getValue());
    if (!existingMap.has(id)) {
      return false;
    }

    existingMap.delete(id);
    this.payloads$.next(existingMap);
    return true;
  }

  /**
   * Initializes the global states.
   *
   * @typeParam T - Type of the root object.
   * @param param0 - Snapshot object to initialize the state with
   * @returns ID of the root object.
   */
  init<T>({rootId, payloads}: Snapshot<T>): StateId<T> {
    const newPayloads = $pipe(
        payloads,
        $map(({id, obj}) => {
          return [id, obj] as [string, any];
        }),
        $asMap(),
    );
    this.payloads$.next(newPayloads);
    return rootId;
  }

  /**
   * @returns Observable that emits the ID of objects that has changed.
   */
  @cache()
  get onChange$(): Observable<StateId<unknown>> {
    return this.payloads$.pipe(
        diffMap(),
        switchMap(diff => {
          switch (diff.type) {
            case 'init':
              return EMPTY;
            case 'delete':
              return observableOf(diff.key);
            case 'set':
              return observableOf(diff.key);
          }
        }),
        map(id => createId(id)),
    );
  }

  /**
   * Retrieves the value associated to the given ID.
   *
   * @typeParams T - Type of the value to be retrieved.
   * @param id - ID of the value to retrieve.
   * @returns Object to resolve the properties of the object corresponding to the ID..
   */
  resolve<T>(id: StateId<T>): Resolver<T> {
    return this.createResolver(this.getValue(id));
  }

  /**
   * Sets the object corresponding to the given ID to the given value.
   *
   * @typeParams T - Type of the object to set.
   * @param id - ID of the value to set.
   * @param value - New value to associate with the ID.
   * @returns True if the ID has existed in the global state.
   */
  set<T, U extends T>({id}: StateId<T>, value: U): boolean {
    const existingMap = new Map(this.payloads$.getValue());
    const hasId = existingMap.has(id);

    existingMap.set(id, value);
    this.payloads$.next(existingMap);
    return hasId;
  }

  /**
   * Dumps all the objects in the global state.
   *
   * @typeParams T - Type of the root object.
   * @param rootId - ID of the root object.
   * @returns All the objects in the global state, or null if the object corresponding to the root
   *     ID doesn't exist..
   */
  snapshot<T>(rootId: StateId<T>): Snapshot<T>|null {
    const payloadMap = this.payloads$.getValue();
    if (!payloadMap.has(rootId.id)) {
      return null;
    }

    const payloads = $pipe(
        payloadMap,
        $map(([id, obj]) => ({id, obj})),
        $asArray(),
    );

    return {rootId, payloads};
  }
}
