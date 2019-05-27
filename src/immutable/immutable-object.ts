import { deepClone, Serializable } from '@nabu';
import { Ctor, Immutable, Setter, WritableKeysOf } from './types';

export type ImmutableOf<O, S> = {
  $update(...newData: Partial<S>[]): ImmutableOf<O, S>;
  readonly $set: Setter<O, S>;
} & Readonly<O>;

export class ImmutableObject<O, S extends Serializable> {
  constructor(
      private readonly specCtor: Ctor<O, S>,
      readonly serializable: S,
      private readonly createFn: (args: S) => Immutable<O, S>,
  ) { }

  $update(...newDataArray: Partial<S>[]): Immutable<O, S> {
    const combinedNewData: S = deepClone(this.serializable);

    for (const newData of newDataArray) {
      Object.assign(combinedNewData, newData);
    }

    return this.createFn(combinedNewData);
  }

  get $set(): Setter<O, S> {
    // Collect the ctor hierarchy.
    const ctors: Function[] = [];
    let currentCtor = this.specCtor;
    while (currentCtor !== null && currentCtor.prototype) {
      ctors.push(currentCtor);
      currentCtor = Object.getPrototypeOf(currentCtor);
    }

    // Get the setter keys.
    const setterKeys: Array<WritableKeysOf<O>> = [];
    for (const ctor of ctors) {
      for (const key of Object.getOwnPropertyNames(ctor.prototype)) {
        const descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, key);
        if (!descriptor) {
          continue;
        }

        if (descriptor.set) {
          setterKeys.push(key as WritableKeysOf<O>);
        }
      }
    }

    // Create the setter.
    const setter: Partial<Setter<O, S>> = {};
    for (const key of setterKeys) {
      const setterFn = (newValue: O[WritableKeysOf<O>]): S => {
        const newSerializable = deepClone(this.serializable);
        const spec = new this.specCtor(newSerializable);
        spec[key] = newValue;

        return newSerializable;
      };

      Object.assign(setter, {[key]: setterFn});
    }

    return setter as Setter<O, S>;
  }
}
