import { Subject, Subscriber, Subscription, SubscriptionLike } from '@rxjs';
import { MapDiff } from './map-observable';

export class MapSubject<K, V> extends Subject<MapDiff<K, V>> {
  private readonly innerMap: Map<K, V>;

  constructor(init: Iterable<[K, V]> = []) {
    super();
    this.innerMap = new Map([...init]);
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _subscribe(subscriber: Subscriber<MapDiff<K, V>>): Subscription {
    // tslint:disable-next-line: deprecation
    const subscription = super._subscribe(subscriber);
    if (subscription && !(subscription as SubscriptionLike).closed) {
      subscriber.next({type: 'init', value: new Map([...this.innerMap])});
    }

    return subscription;
  }

  delete(key: K): void {
    if (!this.innerMap.has(key)) {
      return;
    }

    this.innerMap.delete(key);
    super.next({key, type: 'delete'});
  }

  next(newDiff: MapDiff<K, V>): void {
    switch (newDiff.type) {
      case 'delete':
        this.delete(newDiff.key);
        return;
      case 'init':
        this.setAll(newDiff.value);
        return;
      case 'set':
        this.set(newDiff.key, newDiff.value);
        return;
    }
  }

  set(key: K, value: V): void {
    if (this.innerMap.get(key) === value) {
      return;
    }

    this.innerMap.set(key, value);
    super.next({key, value, type: 'set'});
  }

  setAll(newItems: Map<K, V>): void {
    // Delete the extra items.
    for (const [existingKey] of this.innerMap) {
      if (!newItems.has(existingKey)) {
        this.delete(existingKey);
      }
    }

    // Insert the missing items.
    for (const [newKey, newValue] of newItems) {
      if (this.innerMap.get(newKey) !== newValue) {
        this.set(newKey, newValue);
      }
    }
  }
}
