import { InstanceId } from '../graph/instance-id';

export abstract class Selector<T> {
  constructor() { }

  abstract getId(): InstanceId<T>;

  abstract getValue(root: ShadowRoot): T | null;

  abstract setValue(value: T | null, root: ShadowRoot): void;
}

export abstract class SelectorImpl<T> extends Selector<T> {
  constructor(private readonly id_: InstanceId<T>) {
    super();
  }

  getId(): InstanceId<T> {
    return this.id_;
  }
}

export abstract class SelectorStub<T> extends Selector<T> {
  getId(): InstanceId<T> {
    return this.throwStub();
  }

  getSelector(): string {
    return this.throwStub();
  }

  getValue(): T | null {
    return this.throwStub();
  }

  abstract resolve(allSelectors: {}): SelectorImpl<T>;

  setValue(): void {
    this.throwStub();
  }

  protected throwStub(): any {
    throw new Error('This is a stub. Use resolveSelectors to resolve this.');
  }
}
