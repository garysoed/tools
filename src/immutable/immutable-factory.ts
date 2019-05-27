import { Serializable } from '@nabu';
import { Ctor, Immutable } from './types';
import { ImmutableObject } from './immutable-object';

export class ImmutableFactory<O, S extends Serializable> {
  constructor(private readonly specCtor: Ctor<O, S>) { }

  create(serializable: S): Immutable<O, S> {
    const immutable = new ImmutableObject(
        this.specCtor,
        serializable,
        args => this.create(args),
    );

    // Collect the ctor hierarchy.
    const ctors: Function[] = [];
    let currentCtor = this.specCtor;
    while (currentCtor !== null && currentCtor.prototype) {
      ctors.push(currentCtor);
      currentCtor = Object.getPrototypeOf(currentCtor);
    }

    // Get the getter keys.
    const innerInstance = new this.specCtor(serializable);
    for (const ctor of ctors) {
      for (const key of Object.getOwnPropertyNames(ctor.prototype)) {
        const descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, key);
        if (!descriptor) {
          continue;
        }

        if (descriptor.get) {
          Object.defineProperty(
              immutable,
              key,
              {configurable: true, get: () => (innerInstance as any)[key]},
          );
        }
      }
    }

    return immutable as any;
  }

  get factoryOf(): (target: any) => target is Immutable<O, S> {
    return (target): target is Immutable<O, S> => {
      if (!(target instanceof Object)) {
        return false;
      }

      const ctor = target.specCtor;
      if (!(ctor instanceof Function)) {
        return false;
      }

      return ctor === this.specCtor || ctor.prototype instanceof this.specCtor;
    }
  };
}

export function generateImmutable<S, A extends Serializable>(specCtor: Ctor<S, A>): ImmutableFactory<S, A> {
  return new ImmutableFactory<S, A>(specCtor);
}
