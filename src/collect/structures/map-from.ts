export function mapFrom<K extends number | string, V>(
  record: Record<K, V>,
): ReadonlyMap<K, V> {
  const result = new Map<K, V>();
  for (const key in record) {
    result.set(key, record[key]);
  }

  return result;
}
