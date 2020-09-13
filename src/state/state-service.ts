import { Type } from 'gs-types';
import { BehaviorSubject, EMPTY, Observable, of as observableOf } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { asArray as $asArray } from '../collect/operators/as-array';
import { asMap as $asMap } from '../collect/operators/as-map';
import { asSet as $asSet } from '../collect/operators/as-set';
import { map as $map } from '../collect/operators/map';
import { $pipe } from '../collect/operators/pipe';
import { cache } from '../data/cache';
import { SimpleIdGenerator } from '../random/simple-id-generator';
import { diffMap } from '../rxjs/state/map-diff';

import { Snapshot } from './snapshot';
import { createId, StateId } from './state-id';


/**
 * Manages global states.
 *
 * @remarks
 * Every object added must be immutable. Any mutable values must be added as a separate entry.
 *
 * @thModule state
 */
export class StateService {
  private readonly idGenerator = new SimpleIdGenerator();
  private readonly payloads$ = new BehaviorSubject<ReadonlyMap<string, any>>(new Map());

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
   * Retrieves the value associated to the given ID.
   *
   * @typeParams T - Type of the value to be retrieved.
   * @param id - ID of the value to retrieve.
   * @returns Observable that returns the value associated with the ID, or null if none exists.
   */
  get<T>({id}: StateId<T>): Observable<T|null> {
    return this.payloads$.pipe(
        map(payloads => {
          return payloads.get(id) ?? null;
        }),
        distinctUntilChanged(),
    );
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
   * @returns All the objects in the global state.
   */
  snapshot<T>(rootId: StateId<T>): Snapshot<T> {
    const payloads = $pipe(
        this.payloads$.getValue(),
        $map(([id, obj]) => ({id, obj})),
        $asArray(),
    );

    return {rootId, payloads};
  }
}
