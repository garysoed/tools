import { InstanceofType, IType } from '../check';
import { Jsons } from '../data';
import { instanceId } from '../graph';
import { InstanceId } from '../graph/instance-id';
import { SelectorImpl, SelectorStub } from '../persona/selector';

export interface ElementSelector<T extends HTMLElement> {
  getId(): InstanceId<T>;

  getSelector(): string;
}

export class ElementSelectorStub<T extends HTMLElement>
    extends SelectorStub<T> implements ElementSelector<T> {
  constructor(private readonly path_: string) {
    super();
  }

  resolve(allSelectors: {}): ElementSelectorImpl<T> {
    const value = Jsons.getValue(allSelectors, this.path_);
    if (!InstanceofType(ElementSelectorImpl).check(value)) {
      throw new Error(`Cannot resolve element selector. [${this.path_}] is [${value}], expecting '
          + 'an element selector`);
    }

    return value;
  }
}

export class ElementSelectorImpl<T extends HTMLElement>
    extends SelectorImpl<T> implements ElementSelector<T> {
  constructor(
      private readonly selector_: string,
      private readonly type_: IType<T>,
      id: InstanceId<T>) {
    super(id);
  }

  getSelector(): string {
    return this.selector_;
  }

  getValue(root: ShadowRoot): T {
    const el = root.querySelector(this.selector_);
    if (!this.type_.check(el)) {
      throw new Error(`[${this.selector_}] has the wrong type. Expected: ${this.type_} but was '
          + '${el}`);
    }

    return el;
  }

  setValue(): void {
    throw new Error('Unsupported');
  }
}

export function elementSelector<T extends HTMLElement>(
    selectorOrId: string, type?: IType<T>): ElementSelector<T> {
  if (type) {
    return new ElementSelectorImpl(selectorOrId, type, instanceId(selectorOrId, type));
  } else {
    return new ElementSelectorStub(selectorOrId);
  }
}
