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
    super.next({value, type: 'add'});
  }

  delete(value: T): void {
    if (!this.innerSet.has(value)) {
      return;
    }

    this.innerSet.delete(value);
    super.next({value, type: 'delete'});
  }

  next(newDiff: SetDiff<T>): void {
    switch (newDiff.type) {
      case 'delete':
        this.delete(newDiff.value);
        return;
      case 'add':
        this.add(newDiff.value);
        return;
      case 'init':
        this.setAll(newDiff.value);
        return;
    }
  }

  setAll(newItems: Set<T>): void {
    for (const diffItem of diff(this.innerSet, newItems)) {
      applyDiff(this.innerSet, diffItem);
      super.next(diffItem);
    }
  }
}
