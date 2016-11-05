import {BaseDisposable} from '../dispose/base-disposable';
import {ListenableDom} from '../event/listenable-dom';


/**
 * Base class for all custom elements.
 */
export class BaseElement extends BaseDisposable {
  private element_: ListenableDom<HTMLElement> | null = null;

  constructor() {
    super();
  }

  // TODO: Add parser
  getAttribute(attrName: string): string {
    if (this.element_ === null) {
      return '';
    } else {
      return this.element_.getEventTarget()[attrName];
    }
  }

  getElement(): ListenableDom<HTMLElement> | null {
    return this.element_;
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
   * @param element Reference to the element.
   */
  onCreated(element: HTMLElement): void {
    this.element_ = ListenableDom.of(element);
    this.addDisposable(this.element_);
  }

  /**
   * Called when the element is inserted into the DOM.
   *
   * @param element Reference to the element.
   */
  onInserted(element: HTMLElement): void { }

  /**
   * Called when the element is removed from the DOM.
   *
   * @param element Reference to the element.
   */
  onRemoved(element: HTMLElement): void { }

  // TODO: add parser
  setAttribute(attrName: string, value: string): void {
    if (this.element_ !== null) {
      this.element_.getEventTarget()[attrName] = value;
    }
  }
}
