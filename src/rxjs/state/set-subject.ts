import { Subject, Subscriber, Subscription, SubscriptionLike } from '@rxjs';
import { applyDiff, diff } from './diff-set';
import { SetDiff } from './set-observable';

export class SetSubject<T> extends Subject<SetDiff<T>> {
  private readonly innerSet: Set<T>;

  constructor(init: Iterable<T> = []) {
    super();
    this.innerSet = new Set([...init]);
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _subscribe(subscriber: Subscriber<SetDiff<T>>): Subscription {
    // tslint:disable-next-line: deprecation
    const subscription = super._subscribe(subscriber);
    if (subscription && !(subscription as SubscriptionLike).closed) {
      subscriber.next({type: 'init', value: new Set([...this.innerSet])});
    }

    return subscription;
  }

  add(value: T): void {
    if (this.innerSet.has(value)) {
      return;
    }

    this.innerSet.add(value);
    this.next({value, type: 'add'});
  }

  delete(value: T): void {
    if (!this.innerSet.has(value)) {
      return;
    }

    this.innerSet.delete(value);
    this.next({value, type: 'delete'});
  }

  setAll(newItems: Set<T>): void {
    for (const diffItem of diff(this.innerSet, newItems)) {
      applyDiff(this.innerSet, diffItem);
      this.next(diffItem);
    }
  }
}
