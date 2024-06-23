interface ValueSet<T> {
  readonly isSet: true;
  readonly value: T;
}

interface ValueUnset {
  readonly isSet: false;
}

type MaybeValue<T> = ValueSet<T> | ValueUnset;

const __caches__ = Symbol('caches');
type WithCache<O, V> = O & {[__caches__]?: Map<string | symbol, MaybeValue<V>>};
type Getter<This, V> = (this: This) => V;
type GetterDecorator<This, V> = (
  originalGetter: Getter<This, V>,
  context: ClassGetterDecoratorContext<This, V>,
) => Getter<This, V>;

export function cached<This, V>(): GetterDecorator<WithCache<This, V>, V> {
  return (
    originalGetter: Getter<WithCache<This, V>, V>,
    context: ClassGetterDecoratorContext<WithCache<This, V>, V>,
  ) => {
    return function (this: WithCache<This, V>) {
      const cachedValue = this[__caches__]?.get(context.name) ?? {isSet: false};

      if (cachedValue.isSet) {
        return cachedValue.value;
      }

      const value = originalGetter.call(this);
      this[__caches__] = new Map([
        ...(this[__caches__] ?? new Map<string | symbol, MaybeValue<V>>()),
        [context.name, {isSet: true, value}],
      ]);
      return value;
    };
  };
}
