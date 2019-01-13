import { countable } from '../generators';
import { transform } from '../transform';
import { TypedGenerator } from '../typed-generator';
import { filter } from './filter';
import { map } from './map';
import { zip } from './zip';

export function deleteAt(...indexes: number[]): <T>(from: TypedGenerator<T>) => TypedGenerator<T> {
  return <T>(from: TypedGenerator<T>) => {
    const toDelete = new Set(indexes);

    return transform(
        from,
        zip(countable()),
        filter(([_, index]) => index === undefined || !toDelete.has(index)),
        map(([value]) => value),
    );
  };
}
