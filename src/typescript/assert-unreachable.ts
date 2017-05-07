export function assertUnreachable(v: never): never {
  throw new Error('Unreachable code reached');
}
