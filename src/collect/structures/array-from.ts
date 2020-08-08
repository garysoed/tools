/**
 * Converts from various objects to {@link Array}.
 *
 * @remarks
 * This supports various DOM objects.
 *
 * @param attrs - Map of attributes.
 * @returns `Array` of objects in the given input.
 * @thModule collect.structures
 */
export function arrayFrom(attrs: NamedNodeMap): readonly Attr[];
/**
 * @typeParam N - Type of {@link Node}s in the list.
 * @param nodeListOf - List of `Node`s.
 * @returns `Array` of `Node`s in the list.
 */
export function arrayFrom<N extends Node>(nodeListOf: NodeListOf<N>): readonly N[];
/**
 * @param filelist - List of {@link File}
 * @returns `Array` of `File`s in the list.
 */
export function arrayFrom(filelist: FileList): readonly File[];
/**
 * @param nodeListOf - Collection of {@link Element}s/
 * @returns `Array` of `Element`s in the collection.
 */
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
