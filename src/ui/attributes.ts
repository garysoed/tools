export default {
  add(name: string, value: string, element: HTMLElement, document: Document): Attr {
    let attr = document.createAttribute(name);
    attr.value = value;
    element.setAttributeNode(attr);
    return attr;
  },
};
