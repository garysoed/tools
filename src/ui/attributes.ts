/**
 * Methods to manipulate DOM attributes.
 */
export class Attributes {
  /**
   * Adds a new attribute to the given element.
   *
   * @param name Name of the attribute to add.
   * @param value Value of the attribute to set.
   * @param element Element to add the attribute to.
   * @param document Reference to the document object.
   * @return The newly added attribute.
   */
  static add(name: string, value: string, element: HTMLElement, document: Document): Attr {
    const attr = document.createAttribute(name);
    attr.value = value;
    element.setAttributeNode(attr);
    return attr;
  }

  static get(element: HTMLElement): {[key: string]: string} {
    const attributesRecord: {[key: string]: string} = {};
    const attributes = element.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const item = attributes.item(i);
      attributesRecord[item.name] = item.value;
    }
    return attributesRecord;
  }
}
