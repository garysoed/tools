import {IDomBinder} from './interfaces';
import {Maps} from '../collection/maps';
import {Sets} from '../collection/sets';


export class ChildrenElementsBinder<T> implements IDomBinder<Map<string, T>> {
  private readonly parentEl_: Element;
  private readonly dataSetter_: (data: T, element: Element) => void;
  private readonly generator_: () => Element;
  private readonly elementPool_: Set<Element>;
  private readonly entries_: Map<string, [Element, T]>;

  constructor(
      parentEl: Element,
      dataSetter: (data: T, element: Element) => void,
      generator: () => Element) {
    this.parentEl_ = parentEl;
    this.dataSetter_ = dataSetter;
    this.generator_ = generator;
    this.elementPool_ = new Set();
    this.entries_ = new Map();
  }

  /**
   * Adds an entry.
   *
   * @param key Key of the entry.
   * @param value Value of the entry.
   */
  private addEntry_(key: string, value: T): void {
    if (this.entries_.has(key)) {
      this.removeEntry_(key);
    }

    let element = Sets.of(this.elementPool_).anyValue();
    if (element === null) {
      element = this.generator_();
    } else {
      this.elementPool_.delete(element);
    }

    this.dataSetter_(value, element);
    this.entries_.set(key, [element, value]);
    this.parentEl_.appendChild(element);
  }

  /**
   * Removes an entry.
   *
   * @param key Key of the entry to remove.
   */
  private removeEntry_(key: string): void {
    let entry = this.entries_.get(key);
    if (!!entry) {
      this.elementPool_.add(entry[0]);
      this.parentEl_.removeChild(entry[0]);
      this.entries_.delete(key);
    }
  }

  /**
   * @override
   */
  delete(): void {
    Maps.of(this.entries_)
        .forEach((value: [Element, T], key: string) => {
          this.removeEntry_(key);
        });
  }

  /**
   * @override
   */
  get(): Map<string, T> {
    return Maps
        .of(this.entries_)
        .mapValue((value: [Element, T]) => {
          return value[1];
        })
        .asMap();
  }

  /**
   * @override
   */
  set(value: Map<string, T> | null): void {
    let addedSet: Set<string>;
    let removedSet: Set<string>;
    let sameSet: Set<string>;

    if (value === null) {
      addedSet = new Set();
      removedSet = new Set(this.entries_.keys());
      sameSet = new Set();
    } else {
      let diff = Maps.of(this.entries_)
          .keys()
          .diff(new Set(value.keys()));
      addedSet = diff.added;
      removedSet = diff.removed;
      sameSet = diff.same;
    }

    removedSet.forEach((key: string) => {
      this.removeEntry_(key);
    });

    addedSet.forEach((key: string) => {
      this.addEntry_(key, value!.get(key)!);
    });

    sameSet.forEach((key: string) => {
      let newValue = value!.get(key)!;
      let oldEntry = this.entries_.get(key)!;
      this.dataSetter_(newValue, oldEntry[0]);
    });
  }

  /**
   * Creates a new instance of the binder.
   *
   * @param parentEl Element to append the children to.
   * @param dataSetter Function called to set the data to the generated element.
   * @param generator Generates a new element.
   * @return New instance of the binder.
   */
  static of<T>(
      parentEl: Element,
      dataSetter: (data: T, element: Element) => void,
      generator: () => Element): ChildrenElementsBinder<T> {
    return new ChildrenElementsBinder(parentEl, dataSetter, generator);
  }
}
