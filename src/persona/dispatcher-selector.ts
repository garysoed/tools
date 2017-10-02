import { Asyncs } from '../async/asyncs';
import { InstanceofType } from '../check';
import { instanceId } from '../graph';
import { DispatchFn } from '../interfaces';
import {
  ElementSelectorImpl,
  ElementSelectorStub } from '../persona/element-selector';
import { Listener } from '../persona/listener';
import { SelectorImpl, SelectorStub } from '../persona/selector';
import { DispatcherSelector, ElementSelector } from '../persona/selectors';
import { StubListener } from '../persona/stub-listener';

export class DispatcherSelectorStub<T> extends
    SelectorStub<DispatchFn<T>> implements DispatcherSelector<DispatchFn<T>> {
  constructor(private readonly elementSelector_: ElementSelectorStub<HTMLElement>) {
    super();
  }

  getElementSelector(): ElementSelector<HTMLElement> {
    return this.throwStub();
  }

  resolve(allSelectors: {}): DispatcherSelectorImpl<T> {
    return new DispatcherSelectorImpl(this.elementSelector_.resolve(allSelectors));
  }
}

export class DispatcherSelectorImpl<T> extends
    SelectorImpl<DispatchFn<T>> implements DispatcherSelector<DispatchFn<T>> {
  constructor(private readonly elementSelector_: ElementSelectorImpl<HTMLElement>) {
    super(
        () => undefined,
        instanceId(
            `${elementSelector_.getSelector()}@dispatcher`, InstanceofType(Function) as any));
  }

  getElementSelector(): ElementSelector<HTMLElement> {
    return this.elementSelector_;
  }

  getListener(): Listener<any> {
    return new StubListener();
  }

  getValue(root: ShadowRoot): DispatchFn<T> {
    const element = this.elementSelector_.getValue(root);
    return (name: string, payload: any = null) => {
      return Asyncs.run(() => {
        element.dispatchEvent(new CustomEvent(name, {bubbles: true, detail: payload}));
      });
    };
  }

  setValue_(): void {
    throw new Error('Unsupported');
  }
}

export function dispatcherSelector<T>(
    elementSelector: ElementSelector<HTMLElement>):
    DispatcherSelector<DispatchFn<T>> {
  if (elementSelector instanceof ElementSelectorStub) {
    return new DispatcherSelectorStub(elementSelector);
  } else if (elementSelector instanceof ElementSelectorImpl) {
    return new DispatcherSelectorImpl(elementSelector);
  } else {
    throw new Error(`Unhandled ElementSelector type ${elementSelector}`);
  }
}
