export function arrayFrom(attrs: NamedNodeMap): readonly Attr[];
export function arrayFrom<N extends Node>(nodeListOf: NodeListOf<N>): readonly N[];
export function arrayFrom(nodeListOf: HTMLCollection): readonly Element[];
export function arrayFrom(
    collection: NodeListOf<Node>|HTMLCollection|NamedNodeMap,
): ReadonlyArray<Node|Element> {
  const array: Array<Node|Element> = [];
  for (let i = 0; i < collection.length; i++) {
    const item = collection.item(i);
    if (item) {
      array.push(item);
    }
  }

  return array;
}
