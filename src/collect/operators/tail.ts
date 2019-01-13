import { IsFinite } from '../is-finite';
import { transform } from '../transform';
import { TypedGenerator } from '../typed-generator';
import { head } from './head';
import { reverse } from './reverse';

export function tail(): <T>(from: TypedGenerator<T> & IsFinite) => T|undefined {
  return <T>(from: TypedGenerator<T> & IsFinite) => {
    return transform(from, reverse(), head());
  };
}
