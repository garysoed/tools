import { BaseDisposable } from '../dispose';
import { NodeId } from '../graph/node-id';
import { ImmutableList } from '../immutable';

export const GLOBALS = new BaseDisposable();

export abstract class GNode<T> {
  private readonly previousValueMap_: Map<{}, T> = new Map<string, T>();
  private readonly shouldReexecuteMap_: Map<{}, boolean> = new Map<string, boolean>();

  constructor(private readonly parameterIds_: ImmutableList<NodeId<any>>) { }

  clearCache(context: {} | null): void {
    this.previousValueMap_.delete(context || GLOBALS);
  }

  execute(context: {} | null, params: Iterable<any>): T {
    const normalizedContext = context || GLOBALS;
    const value = this.execute_(normalizedContext, params);
    this.previousValueMap_.set(normalizedContext, value);
    this.shouldReexecuteMap_.set(normalizedContext, false);
    return value;
  }

  protected abstract execute_(context: {}, params: Iterable<any>): T;

  getParameterIds(): ImmutableList<NodeId<any>> {
    return this.parameterIds_;
  }

  getPreviousValue(context: {} | null): T | null {
    return this.previousValueMap_.get(context || GLOBALS) || null;
  }

  setShouldReexecute(context: {} | null): void {
    this.shouldReexecuteMap_.set(context || GLOBALS, true);
  }

  shouldReexecute(context: {} | null): boolean {
    const normalizedContext = context || GLOBALS;
    if (this.shouldReexecuteMap_.has(normalizedContext)) {
      return this.shouldReexecuteMap_.get(normalizedContext)!;
    }
    return true;
  }
}
