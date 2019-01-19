import { createImmutableList, ImmutableList } from '../collect/types/immutable-list';
import { Iterables } from '../immutable';

/**
 * Methods to manipulate DOM objects.
 */
export class Doms {
  /**
   * Returns an iterable that uses a seed value and continuously transforms it.
   *
   * @param start The seed value.
   * @param stepper Function to step to the next value. Return null to stop the iteration.
   * @return Iterable object that starts with the seed value and continuously steps through it.
   * @TODO Move to iterables.
   */
  static domIterable(start: HTMLElement, stepper: (fromEl: HTMLElement) => HTMLElement | null):
      Iterable<HTMLElement> {
    return Iterables.of(function*(): IterableIterator<HTMLElement> {
      let currentEl: HTMLElement | null = start;
      while (currentEl !== null) {
        yield currentEl;
        currentEl = stepper(currentEl);
      }
    });
  }

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

  /**
   * Returns an iterable that navigates up the DOM hierarchy using the `offsetParent` property.
   *
   * @param start The DOM element to start with.
   * @return The iterable that navigates up the `offsetParent` chain.
   */
  static offsetParentIterable(start: HTMLElement): Iterable<HTMLElement> {
    return Doms.domIterable(start, (fromEl: HTMLElement) => {
      return fromEl.offsetParent as HTMLElement;
    });
  }

  /**
   * Returns an iterable that navigates up the DOM hierarchy using the `parentElement` property.
   *
   * @param start The DOM element to start with.
   * @return The iterable that navigates up the parent chain.
   */
  static parentIterable(start: HTMLElement): Iterable<HTMLElement> {
    return Doms.domIterable(start, (fromEl: HTMLElement) => {
      return fromEl.parentElement;
    });
  }

  /**
   * Returns the relative offset top between the two given elements.
   *
   * @param fromEl The element to do measurements from.
   * @param toEl The element to do measurements to.
   * @return The relative offset top between the two given elements.
   */
  static relativeOffsetTop(fromEl: HTMLElement, toEl: HTMLElement): number {
    let distance = 0;
    let foundDestination = false;
    let currentEl;

    for (const value of Doms.offsetParentIterable(fromEl)) {
      currentEl = value;
      if (value === toEl) {
        foundDestination = true;
        break;
      } else {
        distance += currentEl.offsetTop;
      }
    }

    if (!foundDestination) {
      throw Error('Cannot find offset ancestor. Check if the toElement has non static position');
    }

    return distance;
  }
}
