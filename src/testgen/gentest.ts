import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableMap } from '../immutable/immutable-map';
import { TestSpec } from '../testgen/test-spec';

type Specs<V> = {
  [K in keyof V]: TestSpec<V[K]>
};
type Indexes<V> = ImmutableMap<keyof V, number>;

export function generateTests_<V>(
    keys: ImmutableList<keyof V>,
    indexes: Indexes<V>,
    specs: Specs<V>,
    handler: (values: V) => void): void {
  const currentKey = keys.getAt(0);
  if (!currentKey) {
    const partialValues: Partial<V> = {};
    for (const [key, index] of indexes) {
      partialValues[key] = specs[key].values.getAt(index);
    }
    handler(partialValues as V);
  } else {
    const currentValues = specs[currentKey].values;
    const remainingKeys = keys.filter((_: keyof V, index: number) => index > 0);
    for (let i = 0; i < currentValues.size(); i++) {
      generateTests_<V>(
          remainingKeys,
          indexes.set(currentKey, i),
          specs,
          handler);
    }
  }
}

export function gentest<V>(specs: Specs<V>, handler: (values: V) => void): void {
  const partialKeys: (keyof V)[] = [];
  for (const key in specs) {
    partialKeys.push(key);
  }
  generateTests_<V>(
      ImmutableList.of(Object.keys(specs) as (keyof V)[]),
      ImmutableMap.of<keyof V, number>([]),
      specs,
      handler);
}
