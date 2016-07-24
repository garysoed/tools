import {BaseDisposable} from '../dispose/base-disposable';


/**
 * Base class for all custom elements.
 */
export class BaseElement extends BaseDisposable {
  constructor() {
    super();
  }

  /**
   * Called when the element's attribute has changed.
   *
   * @param attrName Name of the attribute that was changed.
   * @param oldValue Old value of the attribute.
   * @param newValue New value of the attribute.
   */
  onAttributeChanged(attrName: string, oldValue: string, newValue: string): void { }

  /**
   * Called when the element is created.
   *
   * @param element Reference to the
   */
  onCreated(element: HTMLElement): void { }

  /**
   * Called when the element is inserted into the DOM.
   */
  onInserted(): void { }

  /**
   * Called when the element is removed from the DOM.
   */
  onRemoved(): void { }
}
