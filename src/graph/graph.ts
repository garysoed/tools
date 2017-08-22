import { GNode } from '../graph/g-node';
import { InnerNode } from '../graph/inner-node';
import { InputNode } from '../graph/input-node';
import { NodeProvider } from '../graph/node-provider';
import { Provider, Provider0, Provider1 } from '../graph/provider';
import { StaticId } from '../graph/static-id';
import { ImmutableList } from '../immutable';

export const setQueue: (() => void)[] = [];
export const staticNodes: Map<StaticId<any>, GNode<any>> = new Map();

export class Graph {
  /**
   * Resets the state for testing.
   */
  static clearForTests(): void {
    staticNodes.clear();
    setQueue.splice(0, setQueue.length);
  }

  /**
   * Creates a new provider.
   * @param staticId
   * @param initValue
   * @return Function to call for setting the value. The return value of this is a Promise that will
   *     be resolved when the value has been set.
   */
  static createProvider<T>(staticId: StaticId<T>, initValue: T): NodeProvider<T> {
    const node = new InputNode<T>();
    node.set(null, initValue);
    staticNodes.set(staticId, node);

    const provider = (newValue: T): Promise<void> => {
      return Graph.set_(staticId, newValue);
    };
    return provider;
  }

  /**
   * Gets the value associated with the given ID.
   * @param staticId
   * @return Promise that will be resolved with the value associated with the given ID.
   */
  static async get<T>(staticId: StaticId<T>): Promise<T> {
    const node = staticNodes.get(staticId);
    if (!node) {
      throw new Error(`Node for ${staticId} cannot be found`);
    }

    const parameters = await Promise.all(node.getParameterIds()
        .map((parameterId: StaticId<any>) => {
          return Graph.get(parameterId);
        }));

    const value = await node.execute(null, parameters);
    if (!staticId.getType().check(value)) {
      throw new Error(`Node for ${staticId} returns the incorrect type. [${value}]`);
    }
    return value;
  }

  private static processSetQueue_(): void {
    for (const setFn of setQueue) {
      setFn();
    }
    setQueue.splice(0, setQueue.length);
  }

  /**
   * Registers the given provider function.
   * @param staticId
   * @param provider
   */
  static registerProvider<T>(staticId: StaticId<T>, provider: Provider0<T>): void;
  static registerProvider<T, P0>(
      staticId: StaticId<T>,
      provider: Provider1<T, P0>,
      arg0: StaticId<P0>): void;
  static registerProvider<T>(
      staticId: StaticId<T>,
      provider: Provider<T>,
      ...args: StaticId<any>[]): void {
    if (staticNodes.has(staticId)) {
      throw new Error(`Node ${staticId} is already registered`);
    }

    const node = new InnerNode<T>(provider, ImmutableList.of(args));
    staticNodes.set(staticId, node);
  }

  private static set_<T>(staticId: StaticId<T>, value: T): Promise<void> {
    const node = staticNodes.get(staticId);
    if (!(node instanceof InputNode)) {
      throw new Error(`Node ${staticId} is not an instance of InputNode. [${node}]`);
    }

    const promise = new Promise<void>((resolve: () => void) => {
      setQueue.push(() => {
        node.set(null, value);
        resolve();
      });
    });

    setTimeout(() => Graph.processSetQueue_(), 0);

    return promise;
  }
}
