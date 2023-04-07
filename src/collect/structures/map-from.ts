export function mapFrom<K extends string|number, V>(
    record: Record<K, V>,
): ReadonlyMap<K, V> {
  const result = new Map<K, V>();
  for (const key in record) {
    result.set(key, record[key]);
  }

  return result;
}