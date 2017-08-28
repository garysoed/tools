import { BaseDisposable } from '../dispose';
import { NodeId } from '../graph/node-id';
import { ImmutableList } from '../immutable';
import { hash } from '../util/hash';

export const GLOBALS = new BaseDisposable();

export abstract class GNode<T> {
  private readonly cacheMap_: Map<string, T> = new Map<string, T>();

  constructor(private readonly parameterIds_: ImmutableList<NodeId<any>>) { }

  clearCache(context: {} | null): void {
    this.cacheMap_.delete(this.hash_(context));
  }

  execute(context: {} | null, params: Iterable<any>): T {
    const value = this.execute_(context || GLOBALS, params);
    this.cacheMap_.set(this.hash_(context), value);
    return value;
  }

  protected abstract execute_(context: {}, params: Iterable<any>): T;

  getParameterIds(): ImmutableList<NodeId<any>> {
    return this.parameterIds_;
  }

  getPreviousValue(context: {} | null): T | null {
    return this.cacheMap_.get(this.hash_(context)) || null;
  }

  private hash_(context: {} | null): string {
    return hash(context || GLOBALS);
  }
}
