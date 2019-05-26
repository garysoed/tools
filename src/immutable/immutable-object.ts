import { Serializable, deepClone } from '@nabu';
import { Ctor, WritableKeysOf, Setter } from './types';

export type ImmutableOf<O, S> = {
  $update(...newData: Partial<S>[]): ImmutableOf<O, S>;
  readonly $set: Setter<O, S>;
} & Readonly<O>;

export class ImmutableObject<S, A extends Serializable> {
  constructor(
      private readonly specCtor: Ctor<S, A>,
      private readonly serializable: A,
      private readonly createFn: (args: A) => ImmutableOf<S, A>,
  ) { }

  $update(...newDataArray: Partial<A>[]): ImmutableOf<S, A> {
    const combinedNewData: A = deepClone(this.serializable);

    for (const newData of newDataArray) {
      Object.assign(combinedNewData, newData);
    }

    return this.createFn(combinedNewData);
  }

  get $set(): Setter<S, A> {
    // Collect the ctor hierarchy.
    const ctors: Function[] = [];
    let currentCtor = this.specCtor;
    while (currentCtor !== null && currentCtor.prototype) {
      ctors.push(currentCtor);
      currentCtor = Object.getPrototypeOf(currentCtor);
    }

    // Get the setter keys.
    const setterKeys: Array<WritableKeysOf<S>> = [];
    for (const ctor of ctors) {
      for (const key of Object.getOwnPropertyNames(ctor.prototype)) {
        const descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, key);
        if (!descriptor) {
          continue;
        }

        if (descriptor.set) {
          setterKeys.push(key as WritableKeysOf<S>);
        }
      }
    }

    // Create the setter.
    const setter: Partial<Setter<S, A>> = {};
    for (const key of setterKeys) {
      const setterFn = (newValue: S[WritableKeysOf<S>]): A => {
        const newSerializable = deepClone(this.serializable);
        const spec = new this.specCtor(newSerializable);
        spec[key] = newValue;

        return newSerializable;
      };

      Object.assign(setter, {[key]: setterFn});
    }

    return setter as Setter<S, A>;
  }
}
