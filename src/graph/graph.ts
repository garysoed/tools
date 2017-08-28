import { BaseDisposable } from '../dispose';
import { Bus } from '../event';
import { GLOBALS, GNode } from '../graph/g-node';
import { EventType, GraphEvent } from '../graph/graph-event';
import { InnerNode } from '../graph/inner-node';
import { InputNode } from '../graph/input-node';
import { InstanceId } from '../graph/instance-id';
import { NodeId } from '../graph/node-id';
import { NodeProvider } from '../graph/node-provider';
import { Provider, Provider0, Provider1, Provider2 } from '../graph/provider';
import { StaticId } from '../graph/static-id';
import { ImmutableList, ImmutableSet } from '../immutable';
import { assertUnreachable, equals } from '../typescript';
import { Log } from '../util';

const LOGGER: Log = Log.of('gs-tools.graph.Graph');

export class GraphImpl extends Bus<EventType, GraphEvent<any, any>> {
  private readonly monitoredNodes_: WeakMap<{}, ImmutableSet<NodeId<any>>> = new WeakMap();
  private readonly nodes_: Map<NodeId<any>, GNode<any>> = new Map();
  private readonly setQueue_: (() => void)[] = [];

  clearNodesForTests(nodeIds: Iterable<NodeId<any>>): void {
    for (const nodeId of nodeIds) {
      this.nodes_.delete(nodeId);
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
    if (this.nodes_.has(staticId)) {
      throw new Error(`Node ${staticId} is already registered`);
    }

    const node = new InputNode<T>();
    node.set(null, initValue);
    this.nodes_.set(staticId, node);

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
  async get<T>(nodeId: NodeId<T>, context: any = GLOBALS): Promise<T> {
    const node = this.nodes_.get(nodeId);
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

    if (context instanceof BaseDisposable &&
        node instanceof InnerNode &&
        node.monitorsChanges() &&
        !this.isMonitored_(context, nodeId)) {
      context.addDisposable(
          this.on(
              'change',
              (event: GraphEvent<T, any>) => {
                this.onChange_<T, any>(nodeId, node, context, event);
              },
              this));

      const ids = this.monitoredNodes_.get(context) || ImmutableSet.of([]);
      this.monitoredNodes_.set(context, ids.add(nodeId));
    }

    const cachedValue = Promise.resolve(node.getPreviousValue(context));
    const value = node.execute(context, parameters);

    const [resolvedCached, resolvedValue] = await Promise.all([cachedValue, value]);
    if (!nodeId.getType().check(resolvedValue)) {
      throw new Error(`Node for ${nodeId} returns the incorrect type. [${resolvedValue}]`);
    }

    if (!equals(resolvedCached, resolvedValue)) {
      this.dispatch({context, id: nodeId, type: 'change' as 'change'});
    }
    return value;
  }

  private isMonitored_(context: {}, nodeId: NodeId<any>): boolean {
    const ids = this.monitoredNodes_.get(context);
    if (!ids) {
      return false;
    }

    return ids.has(nodeId);
  }

  private onChange_<T, C>(
      nodeId: NodeId<T>, node: InnerNode<T>, context: C, event: GraphEvent<T, C>): void {
    const inIds = ImmutableSet.of(node.getParameterIds());
    if (inIds.has(event.id)) {
      node.clearCache(context);
      if (nodeId instanceof InstanceId) {
        this.refresh(nodeId, context);
      } else {
        this.refresh(nodeId);
      }
    }
  }

  private processSetQueue_(): void {
    for (const setFn of this.setQueue_) {
      setFn();
    }
    this.setQueue_.splice(0, this.setQueue_.length);
  }

  async refresh<T>(staticId: StaticId<T>): Promise<T>;
  async refresh<T, C>(instanceId: InstanceId<T>, context: C): Promise<T>;
  async refresh<T, C>(nodeId: StaticId<T> | InstanceId<T>, context: C | null = null): Promise<T> {
    if (nodeId instanceof StaticId) {
      return this.get(nodeId);
    } else if (nodeId instanceof InstanceId) {
      return this.get(nodeId, context);
    } else {
      throw assertUnreachable(nodeId);
    }
  }

  registerGenericProvider_<T>(
      nodeId: NodeId<T>,
      monitorsChanges: boolean,
      provider: Provider<T>,
      ...args: NodeId<any>[]): void {
    if (this.nodes_.has(nodeId)) {
      throw new Error(`Node ${nodeId} is already registered`);
    }

    const node = new InnerNode<T>(provider, monitorsChanges, ImmutableList.of(args));
    this.nodes_.set(nodeId, node);
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
    const node = this.nodes_.get(staticId);
    if (!(node instanceof InputNode)) {
      throw new Error(`Node ${staticId} is not an instance of InputNode. [${node}]`);
    }

    const promise = new Promise<void>((resolve: () => void) => {
      this.setQueue_.push(() => {
        const event = {context: null, id: staticId, type: 'change' as 'change'};
        this.dispatch(event, () => node.set(null, value));
        resolve();
      });
    });

    setTimeout(() => this.processSetQueue_(), 0);

    return promise;
  }

  toString(): string {
    return 'Graph';
  }
}

export const Graph = new GraphImpl(LOGGER);
