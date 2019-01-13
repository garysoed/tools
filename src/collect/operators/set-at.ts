import { countable } from '../generators';
import { transform } from '../transform';
import { TypedGenerator } from '../typed-generator';
import { map } from './map';
import { zip } from './zip';

export function setAt<T>(...setSpecs: Array<[number, T]>):
    (from: TypedGenerator<T>) => TypedGenerator<T> {
  return (from: TypedGenerator<T>) => {
    const setSpecMap = new Map(setSpecs);

    return transform(
        from,
        zip(countable()),
        map(([value, index]) => {
          if (index === undefined) {
            return value;
          }

          const setValue = setSpecMap.get(index);

          return setValue === undefined ? value : setValue;
        }),
    );
  };
}
