import {BaseDisposable} from '../dispose/base-disposable';
import {ListenableDom} from '../event/listenable-dom';


/**
 * Base class for all custom elements.
 */
export class BaseElement extends BaseDisposable {
  private element_: ListenableDom<HTMLElement>;

  constructor() {
    super();
  }

  get element(): ListenableDom<HTMLElement> {
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
   * @param element Reference to the
   */
  onCreated(element: HTMLElement): void {
    this.element_ = ListenableDom.of(element);
    this.addDisposable(this.element_);
  }

  /**
   * Called when the element is inserted into the DOM.
   */
  onInserted(): void { }

  /**
   * Called when the element is removed from the DOM.
   */
  onRemoved(): void { }
}
