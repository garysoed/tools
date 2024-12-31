import {Observable, of, OperatorFunction, pipe, Subject} from 'rxjs';
import {map, switchMap, tap, withLatestFrom} from 'rxjs/operators';

type SubjectsOf<Object> = {
  readonly [Key in keyof Object]: Object[Key] extends Subject<infer S>
    ? S
    : never;
};

export interface ImmutableWalker<Object> extends Observable<Object> {
  _<Key extends keyof Object>(key: Key): ImmutableWalker<Object[Key]>;
  $<Key extends keyof SubjectsOf<Object>>(
    key: Key,
  ): MutableWalker<SubjectsOf<Object>[Key]>;
}

class ImmutableWalkerInternal<T>
  extends Observable<T>
  implements ImmutableWalker<T>
{
  constructor(private readonly source$: Observable<T>) {
    super((subscriber) => {
      return source$.subscribe(subscriber);
    });
  }

  _<K extends keyof T>(key: K): ImmutableWalker<T[K]> {
    return new ImmutableWalkerInternal(
      this.source$.pipe(map((value) => value[key])),
    );
  }
  $<K extends keyof SubjectsOf<T>>(key: K): MutableWalker<SubjectsOf<T>[K]> {
    const subSelf$ = this.source$.pipe(
      map((value) => {
        const mutableState = value[key];
        return mutableState as unknown as Subject<SubjectsOf<T>[K]>;
      }),
    );
    return new MutableWalkerInternal(subSelf$);
  }
}

export interface MutableWalker<T> extends ImmutableWalker<T> {
  set(): OperatorFunction<T, unknown>;
}

class MutableWalkerInternal<T>
  extends ImmutableWalkerInternal<T>
  implements MutableWalker<T>
{
  constructor(private readonly mutableSource$: Observable<Subject<T>>) {
    super(mutableSource$.pipe(switchMap((mutable) => mutable)));
  }

  set(): OperatorFunction<T, unknown> {
    return pipe(
      withLatestFrom(this.mutableSource$),
      tap(([value, mutable]) => {
        mutable.next(value);
      }),
    );
  }
}

export function walkObservable<T>(value$: Subject<T>): MutableWalker<T>;
export function walkObservable<T>(value$: Observable<T>): ImmutableWalker<T>;
export function walkObservable(value$: Observable<any>): ImmutableWalker<any> {
  if (value$ instanceof Subject) {
    return new MutableWalkerInternal(of(value$));
  }
  return new ImmutableWalkerInternal(value$);
}
