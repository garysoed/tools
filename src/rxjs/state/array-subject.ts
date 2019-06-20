import { Subject, Subscriber, Subscription, SubscriptionLike } from '@rxjs';
import { ArrayDiff } from './array-observable';
import { applyDiff, diff } from './diff-array';

export class ArraySubject<T> extends Subject<ArrayDiff<T>> {
  private readonly innerArray: T[];

  constructor(init: Iterable<T> = []) {
    super();
    this.innerArray = [...init];
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _subscribe(subscriber: Subscriber<ArrayDiff<T>>): Subscription {
    // tslint:disable-next-line: deprecation
    const subscription = super._subscribe(subscriber);
    if (subscription && !(subscription as SubscriptionLike).closed) {
      subscriber.next({type: 'init', value: [...this.innerArray]});
    }

    return subscription;
  }

  deleteAt(index: number): void {
    if (this.innerArray[index] === undefined) {
      return;
    }

    this.innerArray.splice(index, 1);
    this.next({index, type: 'delete'});
  }

  insert(payload: T): void {
    this.insertAt(this.innerArray.length, payload);
  }

  insertAt(index: number, payload: T): void {
    this.innerArray.splice(index, 0, payload);
    this.next({index, value: payload, type: 'insert'});
  }

  setAll(newItems: T[]): void {
    for (const diffItem of diff(this.innerArray, newItems)) {
      applyDiff(this.innerArray, diffItem);
      this.next(diffItem);
    }
  }

  setAt(index: number, payload: T): void {
    if (this.innerArray[index] === payload) {
      return;
    }

    this.innerArray[index] = payload;
    this.next({index, value: payload, type: 'set'});
  }
}
