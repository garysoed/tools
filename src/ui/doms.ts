import { createImmutableList, ImmutableList } from '../collection/types/immutable-list';

/**
 * Methods to manipulate DOM objects.
 */
export class Doms {
  /**
   * @param node Node whose next siblings should be returned.
   * @return The next siblings of the node.
   */
  static getNextSiblings(node: Node): ImmutableList<Node> {
    const nodes = [];
    let currentNode = node.nextSibling;
    while (currentNode) {
      nodes.push(currentNode);
      currentNode = currentNode.nextSibling;
    }

    return createImmutableList(nodes);
  }
}
