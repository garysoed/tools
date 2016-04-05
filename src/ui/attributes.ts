/**
 * Methods to manipulate DOM attributes.
 */
class Attributes {
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
    let attr = document.createAttribute(name);
    attr.value = value;
    element.setAttributeNode(attr);
    return attr;
  }
};

export default Attributes;
