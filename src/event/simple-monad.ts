import { Monad } from '../interfaces/monad';
import { Random } from '../random/randomizer';

const RANDOM = Random();

export class SimpleMonad<T> implements Monad<T> {
  constructor(
      private readonly instance_: any,
      private readonly key_: symbol,
      value: any) {
    instance_[key_] = value;
  }

  get(): T {
    return this.instance_[this.key_];
  }

  set(value: T): void {
    this.instance_[this.key_] = value;
  }

  static newFactory<T>(
      key: symbol = Symbol(RANDOM.shortId()),
      initialValue: T): (instance: any) => SimpleMonad<T> {
    return (instance: any) => {
      const value = instance[key] === undefined ? initialValue : instance[key];
      return new SimpleMonad<T>(instance, key, value);
    };
  }
}
