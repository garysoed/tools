export const HASHED_VALUES: Map<any, number> = new Map();
export const GLOBALS = {lastHash: 0};


export function hash(object: any): string {
  if (!HASHED_VALUES.has(object)) {
    HASHED_VALUES.set(object, GLOBALS.lastHash);
    GLOBALS.lastHash++;
  }
  return `${HASHED_VALUES.get(object)}`;
}