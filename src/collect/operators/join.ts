import { Operator } from './operator';

export function join(separator: string): Operator<readonly string[], string> {
  return input => input.join(separator);
}
