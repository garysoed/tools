import { GNode } from '../graph/g-node';
import { InnerNode } from '../graph/inner-node';
import { InputNode } from '../graph/input-node';
import { InstanceId } from '../graph/instance-id';
import { NodeProvider } from '../graph/node-provider';
import { Provider, Provider0, Provider1, Provider2 } from '../graph/provider';
import { StaticId } from '../graph/static-id';
import { ImmutableList } from '../immutable';

type NodeId<T> = StaticId<T> | InstanceId<T, any>;

export const SET_QUEUE: (() => void)[] = [];
export const NODES: Map<NodeId<any>, GNode<any>> = new Map();

export class Graph {
  /**
   * Resets the state for testing.
   */
  static clearForTests(): void {
    NODES.clear();
    SET_QUEUE.splice(0, SET_QUEUE.length);
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
    NODES.set(staticId, node);

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
  static async get<T>(staticId: StaticId<T>): Promise<T>;
  static async get<T, C>(instanceId: InstanceId<T, C>, context: C): Promise<T>;
  static async get<T, C>(nodeId: NodeId<T>, context: C | null = null): Promise<T> {
    const node = NODES.get(nodeId);
    if (!node) {
      throw new Error(`Node for ${nodeId} cannot be found`);
    }

    const parameters = await Promise.all(node.getParameterIds()
        .map((parameterId: NodeId<any>) => {
          if (parameterId instanceof StaticId) {
            return Graph.get(parameterId);
          } else {
            return Graph.get(parameterId, context);
          }
        }));

    const value = await node.execute(context, parameters);
    if (!nodeId.getType().check(value)) {
      throw new Error(`Node for ${nodeId} returns the incorrect type. [${value}]`);
    }
    return value;
  }

  private static processSetQueue_(): void {
    for (const setFn of SET_QUEUE) {
      setFn();
    }
    SET_QUEUE.splice(0, SET_QUEUE.length);
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
  static registerProvider<T, P0, P1>(
      staticId: StaticId<T>,
      provider: Provider2<T, P0, P1>,
      arg0: StaticId<P0>,
      arg1: StaticId<P1>): void;

  static registerProvider<T, C>(instanceId: InstanceId<T, C>, provider: Provider0<T>): void;
  static registerProvider<T, C, P0>(
      instanceId: InstanceId<T, C>,
      provider: Provider1<T, P0>,
      arg0: NodeId<P0>): void;
  static registerProvider<T, C, P0, P1>(
      instanceId: InstanceId<T, C>,
      provider: Provider2<T, P0, P1>,
      arg0: NodeId<P0>,
      arg1: NodeId<P1>): void;

  static registerProvider<T>(
      nodeId: NodeId<T>,
      provider: Provider<T>,
      ...args: NodeId<any>[]): void {
    if (NODES.has(nodeId)) {
      throw new Error(`Node ${nodeId} is already registered`);
    }

    const node = new InnerNode<T>(provider, ImmutableList.of(args));
    NODES.set(nodeId, node);
  }

  private static set_<T>(staticId: StaticId<T>, value: T): Promise<void> {
    const node = NODES.get(staticId);
    if (!(node instanceof InputNode)) {
      throw new Error(`Node ${staticId} is not an instance of InputNode. [${node}]`);
    }

    const promise = new Promise<void>((resolve: () => void) => {
      SET_QUEUE.push(() => {
        node.set(null, value);
        resolve();
      });
    });

    setTimeout(() => Graph.processSetQueue_(), 0);

    return promise;
  }
}
