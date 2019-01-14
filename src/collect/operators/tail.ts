import { transform } from '../transform';
import { FiniteGenerator } from '../types/generator';
import { head } from './head';
import { reverse } from './reverse';

export function tail(): <T>(from: FiniteGenerator<T>) => T|undefined {
  return <T>(from: FiniteGenerator<T>) => {
    return transform<FiniteGenerator<T>, FiniteGenerator<T>, T|undefined>(from, reverse(), head());
  };
}
