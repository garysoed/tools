export function iterableFrom<N extends Node>(nodeListOf: NodeListOf<N>): Iterable<N> {
  const array: N[] = [];
  for (let i = 0; i < nodeListOf.length; i++) {
    array.push(nodeListOf.item(i));
  }

  return array;
}
