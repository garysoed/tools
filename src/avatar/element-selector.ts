import { IType } from '../check';
import { instanceId } from '../graph';
import { InstanceId } from '../graph/instance-id';

export interface ElementSelector<T> {
  getId(): InstanceId<T>;

  getSelector(): string;
}

export class ElementSelectorStub<T> implements ElementSelector<T> {
  constructor(private readonly path_: string) { }

  getId(): InstanceId<T> {
    throw new Error('This is a stub. Use resolveSelectors to resolve this.');
  }

  getPath(): string {
    return this.path_;
  }

  getSelector(): string {
    throw new Error('This is a stub. Use resolveSelectors to resolve this.');
  }
}

export class ElementSelectorImpl<T> implements ElementSelector<T> {
  constructor(
      private readonly selector_: string,
      private readonly instanceId_: InstanceId<T>) { }

  getId(): InstanceId<T> {
    return this.instanceId_;
  }

  getSelector(): string {
    return this.selector_;
  }
}

export function elementSelector<T>(selectorOrId: string, type?: IType<T>): ElementSelector<T> {
  if (type) {
    return new ElementSelectorImpl(selectorOrId, instanceId(selectorOrId, type));
  } else {
    return new ElementSelectorStub(selectorOrId);
  }
}
