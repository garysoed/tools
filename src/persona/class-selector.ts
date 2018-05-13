import { BooleanType } from '../check';
import { instanceId } from '../graph';
import { ElementSelectorImpl, ElementSelectorStub } from '../persona/element-selector';
import { Listener } from '../persona/listener';
import { SelectorImpl, SelectorStub } from '../persona/selector';
import { ClassSelector, ElementSelector } from '../persona/selectors';
import { StubListener } from '../persona/stub-listener';

export class ClassSelectorStub extends SelectorStub<boolean> implements ClassSelector {
  constructor(
      private readonly className_: string,
      private readonly elementSelector_: ElementSelectorStub<HTMLElement>) {
    super();
  }

  resolve(allSelectors: {}): SelectorImpl<boolean> {
    return new ClassSelectorImpl(this.className_, this.elementSelector_.resolve(allSelectors));
  }
}

export class ClassSelectorImpl extends SelectorImpl<boolean> implements ClassSelector {
  constructor(
      private readonly className_: string,
      private readonly elementSelector_: ElementSelectorImpl<HTMLElement>) {
    super(false, instanceId(`${elementSelector_}@class`, BooleanType));
  }

  getListener(): Listener<any> {
    return new StubListener();
  }

  getValue(root: ShadowRoot): boolean | null {
    const element = this.elementSelector_.getValue(root);
    if (!element) {
      return null;
    }

    return element.classList.contains(this.className_);
  }

  setValue_(value: boolean | null, root: ShadowRoot): void {
    const element = this.elementSelector_.getValue(root);
    if (!element) {
      return;
    }
    element.classList.toggle(this.className_, !!value);
  }
}

export function classSelector(
    className: string,
    elementSelector: ElementSelector<HTMLElement>): ClassSelector {
  if (elementSelector instanceof ElementSelectorImpl) {
    return new ClassSelectorImpl(className, elementSelector);
  } else if (elementSelector instanceof ElementSelectorStub) {
    return new ClassSelectorStub(className, elementSelector);
  } else {
    throw new Error(`Unhandled elementSelector type ${elementSelector}`);
  }
}
