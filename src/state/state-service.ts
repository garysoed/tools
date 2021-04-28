import {BehaviorSubject, EMPTY, Observable, of as observableOf, OperatorFunction, pipe} from 'rxjs';
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators';

import {asArray as $asArray} from '../collect/operators/as-array';
import {asMap as $asMap} from '../collect/operators/as-map';
import {map as $map} from '../collect/operators/map';
import {$pipe} from '../collect/operators/pipe';
import {cache} from '../data/cache';
import {BaseIdGenerator} from '../random/base-id-generator';
import {SimpleIdGenerator} from '../random/simple-id-generator';
import {diffMap} from '../rxjs/state/map-diff';

import {Snapshot} from './snapshot';
import {createId, StateId} from './state-id';


type StateIdOf<T> = {
  readonly [K in keyof T]: T[K] extends StateId<infer S> ? S : never;
};

interface AddModification {
  readonly type: 'add';
  readonly value: unknown;
  readonly id: string;
}

interface DeleteModification {
  readonly type: 'delete';
  readonly id: string;
}

interface SetModification {
  readonly type: 'set';
  readonly id: string;
  readonly value: unknown;
}

type Modification = AddModification|DeleteModification|SetModification;

export class Modifier {
  private readonly generatedIds = new Set<string>(this.existingIds);

  constructor(
      private readonly existingIds: ReadonlySet<string>,
      private readonly idGenerator: BaseIdGenerator,
      private readonly modifications: Modification[],
  ) { }

  add<T>(value: T): StateId<T> {
    const id = this.idGenerator.generate(this.generatedIds);
    this.generatedIds.add(id);
    this.modifications.push({type: 'add', id, value});
    return createId(id);
  }

  delete<T>({id}: StateId<T>): boolean {
    this.modifications.push({type: 'delete', id});
    return this.existingIds.has(id);
  }


  set<T, U extends T>({id}: StateId<T>, value: U): boolean {
    this.modifications.push({type: 'set', id, value});
    return this.existingIds.has(id);
  }
}


/**
 * Used to resolve properties of the given ID.
 *
 * @typeParam T - Object to be resolved.
 */
export interface Resolver<T> extends Observable<T|undefined> {
  _<K extends keyof T>(key: K): Observable<T[K]|undefined>;
  $<K extends keyof StateIdOf<T>>(key: K): Resolver<StateIdOf<T>[K]>;
}

type GetValue = <T>(stateId: StateId<T>) => Observable<T|undefined>;
class ResolverInternal<T> extends Observable<T|undefined> implements Resolver<T> {
  constructor(
      private readonly source$: Observable<T|undefined>,
      private readonly getValue: GetValue,
  ) {
    super(subscriber => {
      source$.subscribe(subscriber);
    });
  }

  _<K extends keyof T>(key: K): Observable<T[K]|undefined> {
    return this.source$.pipe(map(value => value?.[key]));
  }

  $<K extends keyof StateIdOf<T>>(key: K): Resolver<StateIdOf<T>[K]> {
    const subSelf$ = this.source$.pipe(
        map(value => value?.[key] as StateId<StateIdOf<T>[K]>|undefined),
        switchMap(stateId => {
          if (stateId === undefined) {
            return observableOf(undefined);
          }

          return this.getValue(stateId);
        }),
    );
    return new ResolverInternal(subSelf$, this.getValue);
  }
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

  private getValue<T>({id}: StateId<T>): Observable<T|undefined> {
    return this.payloads$.pipe(
        map(payloads => payloads.get(id)),
        distinctUntilChanged(),
    );
  }

  /**
   * Removes all added entries.
   */
  clear(): void {
    this.payloads$.next(new Map());
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

  modify<T>(modifierFn: (modifier: Modifier) => T): T {
    const modifications: Modification[] = [];
    const returnValue = modifierFn(
        new Modifier(
            new Set(this.payloads$.getValue().keys()),
            this.idGenerator,
            modifications,
        ),
    );

    const resultMap = new Map(this.payloads$.getValue());
    for (const modification of modifications) {
      switch (modification.type) {
        case 'add':
          resultMap.set(modification.id, modification.value);
          break;
        case 'delete':
          resultMap.delete(modification.id);
          break;
        case 'set':
          resultMap.set(modification.id, modification.value);
          break;
      }
    }
    this.payloads$.next(resultMap);
    return returnValue;
  }

  modifyOperator<F, T>(modifierFn: (modifier: Modifier, input: F) => T): OperatorFunction<F, T> {
    return pipe(
        map(input => this.modify(modifier => modifierFn(modifier, input))),
    );
  }

  /**
   * @returns Observable that emits the ID of objects that has changed.
   * TODO: This seems useless now. Replace with changes$?
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
  resolve<T>(id: StateId<T>|undefined|null): Resolver<T> {
    if (!id) {
      return new ResolverInternal<T>(observableOf(undefined), id => this.getValue(id));
    }
    return new ResolverInternal<T>(this.getValue(id), id => this.getValue(id));
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
