export function arrayFrom(attrs: NamedNodeMap): readonly Attr[];
export function arrayFrom<N extends Node>(nodeListOf: NodeListOf<N>): readonly N[];
export function arrayFrom(filelist: FileList): readonly File[];
export function arrayFrom(nodeListOf: HTMLCollection): readonly Element[];
export function arrayFrom(
    collection: NodeListOf<Node>|HTMLCollection|NamedNodeMap|FileList,
): ReadonlyArray<Node|Element|File> {
  const array: Array<Node|Element|File> = [];
  for (let i = 0; i < collection.length; i++) {
    const item = collection.item(i);
    if (item) {
      array.push(item);
    }
  }

  return array;
}
