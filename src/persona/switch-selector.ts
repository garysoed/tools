
type Factory<T> = (document: Document, value: T) => HTMLElement;

export const __cache = Symbol('cache');
export const __value = Symbol('value');

export class SwitchSelectorStub<T> extends SelectorStub<T> implements SwitchSelector<T> {
  constructor(
      private readonly factory_: Factory<T>,
      private readonly slotSelector_: SlotSelectorStub,
      private readonly dataType_: Type<T>,
      private readonly defaultValue_: T) {
    super();
  }

  resolve(allSelectors: {}): SwitchSelectorImpl<T> {
    return new SwitchSelectorImpl(
        this.factory_,
        this.slotSelector_.resolve(allSelectors),
        this.dataType_,
        this.defaultValue_);
  }
}

export class SwitchSelectorImpl<T> extends SelectorImpl<T> implements SwitchSelector<T> {
  constructor(
      private readonly factory_: Factory<T>,
      private readonly slotSelector_: SlotSelectorImpl,
      dataType_: Type<T>,
      defaultValue: T) {
    super(
        defaultValue,
        instanceId(
            `${slotSelector_.getParentSelector().getSelector()}@switch`,
            dataType_));
  }

  getCache_(root: ShadowRoot): Map<T, HTMLElement> {
    const cache = root[__cache];
    if (cache) {
      return cache;
    }

    const newCache = new Map();
    root[__cache] = newCache;
    return newCache;
  }

  getElement_(root: ShadowRoot): HTMLElement | null {
    const slot = this.slotSelector_.getValue(root);
    const el = slot.start.nextSibling;
    if (!el) {
      return null;
    }

    if (el === slot.end) {
      return null;
    }

    if (!(el instanceof HTMLElement)) {
      return null;
    }

    return el;
  }

  getListener(): Listener<any> {
    return new StubListener();
  }

  getValue(root: ShadowRoot): T | null {
    const el = this.getElement_(root);
    if (!el) {
      return null;
    }
    return el[__value] || null;
  }

  setElement_(root: ShadowRoot, el: HTMLElement | null): void {
    const slot = this.slotSelector_.getValue(root);

    const parentEl = slot.start.parentElement;
    if (!parentEl) {
      return;
    }

    // Remove the old element.
    const oldEl = this.getElement_(root);
    if (oldEl) {
      oldEl.remove();
    }

    if (!el) {
      return;
    }

    parentEl.insertBefore(el, slot.end);
  }

  setValue_(value: T | null, root: ShadowRoot): void {
    if (this.getValue(root) === value) {
      return;
    }

    // Add the new element.
    if (value !== null) {
      const cache = this.getCache_(root);
      const el = cache.get(value);
      if (el) {
        this.setElement_(root, el);
      } else {
        const newEl = this.factory_(root.ownerDocument, value);
        cache.set(value, newEl);
        this.setElement_(root, newEl);
      }
    } else {
      this.setElement_(root, null);
    }
  }
}

export function switchSelector<T>(
    factory: Factory<T>,
    slotSelector: SlotSelector,
    dataType: Type<T>,
    defaultValue: T): SwitchSelector<T> {
  if (slotSelector instanceof SlotSelectorImpl) {
    return new SwitchSelectorImpl(
        factory,
        slotSelector,
        dataType,
        defaultValue);
  } else if (slotSelector instanceof SlotSelectorStub) {
    return new SwitchSelectorStub(
      factory,
      slotSelector,
      dataType,
      defaultValue);
  } else {
    throw new Error(`Unhandled slotSelector type ${slotSelector}`);
  }
}
