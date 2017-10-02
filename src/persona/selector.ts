import { BaseDisposable } from '../dispose';
import { AssertionError } from '../error';
import { GraphTime, InstanceNodeProvider } from '../graph';
import { InstanceId } from '../graph/instance-id';
import { Listener } from '../persona/listener';
import { __shadowRoot } from '../persona/shadow-root-symbol';

export const __time = Symbol('time');

export abstract class Selector<T> {
  constructor() { }

  abstract getDefaultValue(): T | undefined;

  abstract getId(): InstanceId<T>;

  abstract getListener(): Listener<any>;

  abstract getProvider(): () => T | null;

  abstract getValue(root: ShadowRoot): T | null;

  abstract initAsInput(
      root: ShadowRoot, ctrl: BaseDisposable, provider: InstanceNodeProvider<T>): void;

  abstract setValue(value: T | null, root: ShadowRoot, time: GraphTime): void;

  protected abstract setValue_(value: T | null, root: ShadowRoot): void;
}

export abstract class SelectorImpl<T> extends Selector<T> {
  constructor(
      private readonly defaultValue_: T | undefined,
      private readonly id_: InstanceId<T>) {
    super();
  }

  getDefaultValue(): T | undefined {
    return this.defaultValue_;
  }

  getId(): InstanceId<T> {
    return this.id_;
  }

  getProvider(): () => T | null {
    const self = this;
    return function(this: {}): T | null {
      const root = this[__shadowRoot];
      if (!(root instanceof DocumentFragment)) {
        throw new Error(`Cannot find shadowRoot in ${this}`);
      }

      return self.getValue(root as ShadowRoot);
    };
  }

  initAsInput(root: ShadowRoot, ctrl: BaseDisposable, provider: InstanceNodeProvider<T>): void {
    this.updateProvider_(root, ctrl, provider);
    const listener = this.getListener();
    ctrl.addDisposable(listener.start(
        root,
        () => {
          this.updateProvider_(root, ctrl, provider);
        },
        this,
        false));
  }

  setValue(value: T | null, root: ShadowRoot, time: GraphTime): void {
    const latestTime: GraphTime | undefined = root[__time];
    if (!latestTime || latestTime.before(time)) {
      this.setValue_(value, root);
      root[__time] = time;
    }
  }

  protected updateProvider_(
      root: ShadowRoot,
      ctrl: BaseDisposable,
      provider: InstanceNodeProvider<T>): void {
    const value = this.getValue(root);
    const type = this.getId().getType();
    const normalizedValue = type.check(value) ? value : this.getDefaultValue();
    if (!type.check(normalizedValue)) {
      throw AssertionError.type(`value for input ${this}`, type, normalizedValue);
    }
    provider(normalizedValue, ctrl);
  }
}

export abstract class SelectorStub<T> extends Selector<T> {
  getDefaultValue(): T | undefined {
    return this.throwStub();
  }

  getId(): InstanceId<T> {
    return this.throwStub();
  }

  getListener(): Listener<T> {
    return this.throwStub();
  }

  getProvider(): () => T | null {
    return this.throwStub();
  }

  getSelector(): string {
    return this.throwStub();
  }

  getValue(): T | null {
    return this.throwStub();
  }

  initAsInput(): void {
    this.throwStub();
  }

  abstract resolve(allSelectors: {}): SelectorImpl<T>;

  setValue(): void {
    this.throwStub();
  }

  setValue_(): void {
    this.throwStub();
  }

  protected throwStub(): any {
    throw new Error('This is a stub. Use resolveSelectors to resolve this.');
  }
}
