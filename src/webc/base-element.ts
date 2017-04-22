import { BaseListener } from '../event/base-listener';
import { ListenableDom } from '../event/listenable-dom';


/**
 * Base class for all custom elements.
 */
export class BaseElement extends BaseListener {
  protected element_: ListenableDom<HTMLElement> | null = null;

  constructor() {
    super();
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
}
