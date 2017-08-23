import { BaseDisposable } from '../dispose';
import { Bus } from '../event';
import { GNode } from '../graph/g-node';
import { EventType, GraphEvent } from '../graph/graph-event';
import { InnerNode } from '../graph/inner-node';
import { InputNode } from '../graph/input-node';
import { InstanceId } from '../graph/instance-id';
import { NodeId } from '../graph/node-id';
import { NodeProvider } from '../graph/node-provider';
import { Provider, Provider0, Provider1, Provider2 } from '../graph/provider';
import { StaticId } from '../graph/static-id';
import { ImmutableList, ImmutableSet } from '../immutable';
import { Log } from '../util';

const LOGGER: Log = Log.of('gs-tools.graph.Graph');
export const SET_QUEUE: (() => void)[] = [];
export const NODES: Map<NodeId<any>, GNode<any>> = new Map();
export const MONITORED_NODES: WeakMap<{}, ImmutableSet<InstanceId<any>>> = new WeakMap();

class GraphImpl extends Bus<EventType, GraphEvent<any, any>> {
  /**
   * Resets the state for testing.
   */
  clearForTests(): void {
    NODES.clear();
    SET_QUEUE.splice(0, SET_QUEUE.length);
  }

  clearNodesForTests(nodeIds: Iterable<NodeId<any>>): void {
    for (const nodeId of nodeIds) {
      NODES.delete(nodeId);
    }
  }

  /**
   * Creates a new provider.
   * @param staticId
   * @param initValue
   * @return Function to call for setting the value. The return value of this is a Promise that will
   *     be resolved when the value has been set.
   */
  createProvider<T>(staticId: StaticId<T>, initValue: T): NodeProvider<T> {
    if (NODES.has(staticId)) {
      throw new Error(`Node ${staticId} is already registered`);
    }

    const node = new InputNode<T>();
    node.set(null, initValue);
    NODES.set(staticId, node);

    const provider = (newValue: T): Promise<void> => {
      return this.set_(staticId, newValue);
    };
    return provider;
  }

  /**
   * Gets the value associated with the given ID.
   * @param staticId
   * @return Promise that will be resolved with the value associated with the given ID.
   */
  async get<T>(staticId: StaticId<T>): Promise<T>;
  async get<T, C>(instanceId: InstanceId<T>, context: C): Promise<T>;
  async get<T, C>(nodeId: NodeId<T>, context: C | null = null): Promise<T> {
    const node = NODES.get(nodeId);
    if (!node) {
      throw new Error(`Node for ${nodeId} cannot be found`);
    }

    const parameters = await Promise.all(node.getParameterIds()
        .map((parameterId: NodeId<any>) => {
          if (parameterId instanceof StaticId) {
            return this.get(parameterId);
          } else {
            return this.get(parameterId, context);
          }
        }));

    if (context !== null &&
        context instanceof BaseDisposable &&
        nodeId instanceof InstanceId &&
        node instanceof InnerNode &&
        node.monitorsChanges() &&
        !this.isMonitored_(context, nodeId)) {
      context.addDisposable(
          this.on(
              'change',
              (event: GraphEvent<T, C>) => {
                Graph.onChange_<T, C>(nodeId, node, context, event);
              },
              this));

      const ids = MONITORED_NODES.get(context) || ImmutableSet.of([]);
      MONITORED_NODES.set(context, ids.add(nodeId));
    }

    const value = await node.execute(context, parameters);
    if (!nodeId.getType().check(value)) {
      throw new Error(`Node for ${nodeId} returns the incorrect type. [${value}]`);
    }
    return value;
  }

  private isMonitored_(context: {}, nodeId: InstanceId<any>): boolean {
    const ids = MONITORED_NODES.get(context);
    if (!ids) {
      return false;
    }

    return ids.has(nodeId);
  }

  private onChange_<T, C>(
      nodeId: InstanceId<T>, node: InnerNode<T>, context: C, event: GraphEvent<T, C>): void {
    const inIds = ImmutableSet.of(node.getParameterIds());
    if (inIds.has(event.id)) {
      this.get(nodeId, context);
    }
  }

  private processSetQueue_(): void {
    for (const setFn of SET_QUEUE) {
      setFn();
    }
    SET_QUEUE.splice(0, SET_QUEUE.length);
  }

  registerGenericProvider_<T>(
      nodeId: NodeId<T>,
      monitorsChanges: boolean,
      provider: Provider<T>,
      ...args: NodeId<any>[]): void {
    if (NODES.has(nodeId)) {
      throw new Error(`Node ${nodeId} is already registered`);
    }

    const node = new InnerNode<T>(provider, monitorsChanges, ImmutableList.of(args));
    NODES.set(nodeId, node);
  }

  /**
   * Registers the given provider function.
   * @param staticId
   * @param provider
   */
  registerProvider<T>(
      staticId: StaticId<T>,
      monitorsChanges: boolean,
      provider: Provider0<T>): void;
  registerProvider<T, P0>(
      staticId: StaticId<T>,
      monitorsChanges: boolean,
      provider: Provider1<T, P0>,
      arg0: StaticId<P0>): void;
  registerProvider<T, P0, P1>(
      staticId: StaticId<T>,
      monitorsChanges: boolean,
      provider: Provider2<T, P0, P1>,
      arg0: StaticId<P0>,
      arg1: StaticId<P1>): void;

  registerProvider<T>(
      instanceId: InstanceId<T>,
      monitorsChanges: boolean,
      provider: Provider0<T>): void;
  registerProvider<T, P0>(
      instanceId: InstanceId<T>,
      monitorsChanges: boolean,
      provider: Provider1<T, P0>,
      arg0: NodeId<P0>): void;
  registerProvider<T, P0, P1>(
      instanceId: InstanceId<T>,
      monitorsChanges: boolean,
      provider: Provider2<T, P0, P1>,
      arg0: NodeId<P0>,
      arg1: NodeId<P1>): void;

  registerProvider<T>(
      nodeId: NodeId<T>,
      monitorsChanges: boolean,
      provider: Provider<T>,
      ...args: NodeId<any>[]): void {
    this.registerGenericProvider_(nodeId, monitorsChanges, provider, ...args);
  }

  private set_<T>(staticId: StaticId<T>, value: T): Promise<void> {
    const node = NODES.get(staticId);
    if (!(node instanceof InputNode)) {
      throw new Error(`Node ${staticId} is not an instance of InputNode. [${node}]`);
    }

    const promise = new Promise<void>((resolve: () => void) => {
      SET_QUEUE.push(() => {
        const event = {context: null, id: staticId, type: 'change' as 'change'};
        this.dispatch(event, () => node.set(null, value));
        resolve();
      });
    });

    setTimeout(() => this.processSetQueue_(), 0);

    return promise;
  }
}

export const Graph = new GraphImpl(LOGGER);
