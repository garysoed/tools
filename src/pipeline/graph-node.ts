import { Arrays } from '../collection/arrays';
import { Maps } from '../collection/maps';

import { ArgMetaData } from './arg-meta-data';


/**
 * A node in the graph.
 *
 * This handles caching data resulting from evaluating the node and evaluating the node.
 */
export class GraphNode<T> {
  private __cache_: symbol;
  private argsMetaData_: ArgMetaData[];
  private fn_: (...args: any[]) => T;

  /**
   * @param fn The function to run when evaluating the node.
   * @param argsMetaData The metadata of the arguments for this node.
   * @hidden
   */
  constructor(fn: (...args: any[]) => T, argsMetaData: ArgMetaData[]) {
    this.__cache_ = Symbol(fn.name);
    this.argsMetaData_ = argsMetaData;
    this.fn_ = fn;
  }

  /**
   * @param The context to get the cache mapping from.
   * @return The cache mapping.
   */
  private getCache(context: any): Map<any[], T> {
    if (!context[this.__cache_]) {
      context[this.__cache_] = new Map<any[], T>();
    }
    return context[this.__cache_];
  }

  /**
   * Clears the cache for the given context and call arguments.
   *
   * @param context The context to clear the cache.
   * @param args The where the corresponding cached values should be cleared.
   */
  clearCache(context: any, args: any[]): void {
    const cache = this.getCache(context);
    const cacheKey = Maps.of(cache)
        .findKey((value: T, key: any[]) => {
          return Arrays.of(key).equalsTo(args);
        });
    if (!!cacheKey) {
      cache.delete(cacheKey);
    }
  }

  /**
   * The argument metadata for this node.
   */
  getArgs(): ArgMetaData[] {
    return this.argsMetaData_;
  }

  /**
   * Runs the node on the given context and arguments.
   *
   * @param context The context to run the node in.
   * @param args The arguments for running the node.
   * @param opt_forceCacheClear Set to true iff the cache should be cleared. Defaults to false.
   * @return Result of running the node.
   */
  run(context: any, args: any[], opt_forceCacheClear: boolean = false): T {
    // Checks if the cache should be cleared.
    if (opt_forceCacheClear) {
      this.clearCache(context, args);
    }

    const cache = this.getCache(context);

    // Find the corresponding entry in the cache.
    let cacheKey = Maps.of(cache)
        .findKey((value: T, key: any[]) => {
          return Arrays.of(key).equalsTo(args);
        });

    if (cacheKey === null) {
      cacheKey = args;
    }

    // Check if the result is cached.
    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, this.fn_.apply(context, args));
    }
    return cache.get(cacheKey)!;
  }

  /**
   * Creates a new instance of the node.
   *
   * @param fn The function to run when evaluating the node.
   * @param argsMetaData The metadata of the arguments for this node.
   * @return The newly created node.
   */
  static newInstance<T>(
      fn: (...args: any[]) => T,
      argsData: ArgMetaData[]): GraphNode<T> {
    // TODO: Check that the arg data has no holes.
    return new GraphNode<T>(fn, argsData);
  }
}
