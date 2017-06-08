import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableSet } from '../immutable/immutable-set';
import { DomBinder } from '../interfaces/dom-binder';


export class ClassListBinder implements DomBinder<ImmutableSet<string>> {
  private readonly classList_: DOMTokenList;

  /**
   * @param element The element to bind to.
   */
  constructor(element: Element) {
    this.classList_ = element.classList;
  }

  /**
   * @override
   */
  delete(): void {
    for (const className of ImmutableList.of(this.classList_)) {
      this.classList_.remove(className);
    }
  }

  /**
   * @override
   */
  get(): ImmutableSet<string> {
    return ImmutableSet.of(ImmutableList.of(this.classList_));
  }

  /**
   * @override
   */
  set(value: ImmutableSet<string> | null): void {
    const classNames = value || ImmutableSet.of([]);

    // Remove the ones that are removed.
    for (const className of ImmutableList.of(this.classList_)) {
      if (!classNames.has(className)) {
        this.classList_.remove(className);
      }
    }
    // Add new ones.
    for (const className of classNames) {
      this.classList_.add(className);
    }
  }

  /**
   * Creates a new instance of the binder.
   *
   * @param element The element to bind to.
   * @return New instance of the binder.
   */
  static of(element: Element): ClassListBinder {
    return new ClassListBinder(element);
  }
}
