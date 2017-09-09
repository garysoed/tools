import { BaseDisposable } from '../dispose';
import { AssertionError } from '../error';
import { Bus } from '../event';
import { GLOBALS, GNode } from '../graph/g-node';
import { EventType, GraphEvent } from '../graph/graph-event';
import { GraphTime } from '../graph/graph-time';
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
  private currentTime_: GraphTime = GraphTime.new();
  private readonly monitoredNodes_: WeakMap<{}, ImmutableSet<NodeId<any>>> = new WeakMap();
  private readonly nodes_: Map<NodeId<any>, GNode<any>> = new Map();
  private readonly setQueue_: (() => void)[] = [];
  private readonly transitiveDependencies_: Map<NodeId<any>, ImmutableSet<NodeId<any>>> = new Map();

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
  createProvider<T>(staticId: StaticId<T>, initValue: T): NodeProvider<T>;
  createProvider<T>(instanceId: InstanceId<T>, initValue: T, context: {}): NodeProvider<T>;
  createProvider<T>(nodeId: NodeId<T>, initValue: T, context: {} = GLOBALS): NodeProvider<T> {
    if (this.nodes_.has(nodeId)) {
      throw new Error(`Node ${nodeId} is already registered`);
    }

    const node = new InputNode<T>();
    node.set(context, this.currentTime_, initValue);
    this.nodes_.set(nodeId, node);

    const provider = (newValue: T): Promise<void> => {
      return this.set_(nodeId, context, newValue);
    };
    return provider;
  }

  private dependsOn_(sourceId: NodeId<any>, targetId: NodeId<any>): boolean {
    return this.getTransitiveDependencies_(sourceId).has(targetId);
  }

  /**
   * Gets the value associated with the given ID.
   * @param staticId
   * @return Promise that will be resolved with the value associated with the given ID.
   */
  async get<T>(staticId: StaticId<T>, timestamp: GraphTime): Promise<T>;
  async get<T, C extends BaseDisposable>(
      instanceId: InstanceId<T>, timestamp: GraphTime, context: C): Promise<T>;
  async get<T>(
      nodeId: NodeId<T>, timestamp: GraphTime, context: BaseDisposable = GLOBALS): Promise<T> {
    // TODO: This needs a ticketing system.
    Log.debug(LOGGER, `getting: ${nodeId}`);
    const idealExecutionTime = nodeId instanceof StaticId ?
        this.getIdealExecutionTime_(nodeId, timestamp) :
        this.getIdealExecutionTime_(nodeId, timestamp, context);

    const node = this.getNode_(nodeId);
    const latestCacheValue = node.getLatestCacheValue(context, idealExecutionTime);

    const parameters = await Promise.all(node.getParameterIds()
        .map((parameterId: NodeId<any>) => {
          if (parameterId instanceof StaticId) {
            return this.get(parameterId, idealExecutionTime);
          } else {
            return this.get(parameterId, idealExecutionTime, context);
          }
        }));

    if (node instanceof InnerNode &&
        !this.isMonitored_(context, nodeId)) {
      context.addDisposable(
          this.on(
              'ready',
              (event: GraphEvent<T, any>) => {
                this.onReady_<T, any>(nodeId, context, event);
              },
              this));

      const ids = this.monitoredNodes_.get(context) || ImmutableSet.of([]);
      this.monitoredNodes_.set(context, ids.add(nodeId));
    }

    Log.debug(LOGGER, `executing: ${nodeId}`);
    const value = node.execute(context, parameters, idealExecutionTime);

    const cachedValue = latestCacheValue ? latestCacheValue[1] : null;
    const [resolvedCached, resolvedValue] = await Promise.all([cachedValue, value]);
    if (!nodeId.getType().check(resolvedValue)) {
      throw new Error(`Node for ${nodeId} returns the incorrect type. [${resolvedValue}]`);
    }

    if (!equals(resolvedCached, resolvedValue)) {
      this.dispatch({context, id: nodeId, type: 'change' as 'change'});
    }

    Log.debug(LOGGER, `executed: ${nodeId} ${resolvedValue}`);
    return resolvedValue;
  }

  private getIdealExecutionTime_(staticId: StaticId<any>, timestamp: GraphTime): GraphTime;
  private getIdealExecutionTime_(instanceId: InstanceId<any>, timestamp: GraphTime, context: {}):
      GraphTime;
  private getIdealExecutionTime_(
      nodeId: NodeId<any>,
      timestamp: GraphTime,
      context: {} = GLOBALS): GraphTime {
    const node = this.getNode_(nodeId);
    const parameterIds = node.getParameterIds();
    if (parameterIds.size() === 0) {
      const entry = node.getLatestCacheValue(context, timestamp);
      return entry ? entry[0] : this.currentTime_;
    }
    const times = parameterIds
        .map((id: NodeId<any>) => {
          if (id instanceof StaticId) {
            return this.getIdealExecutionTime_(id, timestamp);
          } else {
            return this.getIdealExecutionTime_(id, timestamp, context);
          }
        });
    return times.reduce((prev: GraphTime, current: GraphTime) => {
          return prev.beforeOrEqualTo(current) ? current : prev;
        },
        times.getAt(0)!);
  }

  private getNode_<T>(nodeId: NodeId<T>): GNode<T> {
    const node = this.nodes_.get(nodeId);
    if (!node) {
      throw new Error(`Node for ${nodeId} cannot be found`);
    }

    return node;
  }

  getTimestamp(): GraphTime {
    return this.currentTime_;
  }

  private getTransitiveDependencies_(nodeId: NodeId<any>): ImmutableSet<NodeId<any>> {
    const existingDependencies = this.transitiveDependencies_.get(nodeId);
    if (existingDependencies) {
      return existingDependencies;
    }

    const node = this.nodes_.get(nodeId);
    if (!node) {
      throw AssertionError.generic(`Cannot find node for ${nodeId}`);
    }

    const dependencies: Set<NodeId<any>> = new Set();
    for (const paramId of node.getParameterIds()) {
      dependencies.add(paramId);
      for (const dependency of this.getTransitiveDependencies_(paramId)) {
        dependencies.add(dependency);
      }
    }
    const deps = ImmutableSet.of(dependencies);
    this.transitiveDependencies_.set(nodeId, deps);
    return deps;
  }

  private isMonitored_(context: {}, nodeId: NodeId<any>): boolean {
    const ids = this.monitoredNodes_.get(context);
    if (!ids) {
      return false;
    }

    return ids.has(nodeId);
  }

  private onReady_<T, C>(nodeId: NodeId<T>, context: C, event: GraphEvent<T, C>): void {
    if (this.dependsOn_(nodeId, event.id)) {
      if (nodeId instanceof StaticId) {
        this.refresh(nodeId);
      } else if (nodeId instanceof InstanceId) {
        this.refresh(nodeId, context);
      } else {
        assertUnreachable(nodeId);
      }
    }
  }

  private processSetQueue_(): void {
    for (const setFn of this.setQueue_) {
      setFn();
    }
    this.setQueue_.splice(0, this.setQueue_.length);
  }

  refresh<T>(staticId: StaticId<T>): void;
  refresh<T, C>(instanceId: InstanceId<T>, context: C): void;
  refresh<T, C>(nodeId: StaticId<T> | InstanceId<T>, context: C | null = null): void {
    const node = this.nodes_.get(nodeId);
    if (!node) {
      throw AssertionError.generic(`Cannot find node ${nodeId}`);
    }
    this.dispatch({context, id: nodeId, type: 'ready'});
  }

  registerGenericProvider_<T>(
      nodeId: NodeId<T>,
      provider: Provider<T>,
      ...args: NodeId<any>[]): void {
    const existingNode = this.nodes_.get(nodeId);
    if (existingNode) {
      if (!(existingNode instanceof InnerNode)) {
        throw AssertionError.generic(`node for ${nodeId} is already registered as InputNode`);
      }

      if (existingNode.getProvider().toString() !== provider.toString()) {
        throw AssertionError.equals(
            `reregistered node provider for ${nodeId}`,
            existingNode.getProvider(),
            provider);
      }

      const existingArgs = existingNode.getParameterIds();
      const newArgs = ImmutableList.of(args);
      const maxIndex = Math.max(existingArgs.size(), newArgs.size());
      for (let i = 0; i < maxIndex; i++) {
        const existingArg = existingArgs.getAt(i);
        const newArg = newArgs.getAt(i);
        if (existingArg !== newArg) {
          throw AssertionError.equals(
              `reregistered node parameter ${i} for ${nodeId}`,
              existingArg,
              newArg);
        }
      }
      return;
    }

    const node = new InnerNode<T>(provider, ImmutableList.of(args));
    this.nodes_.set(nodeId, node);
  }

  /**
   * Registers the given provider function.
   * @param staticId
   * @param provider
   */
  registerProvider<T>(
      staticId: StaticId<T>,
      provider: Provider0<T>): void;
  registerProvider<T, P0>(
      staticId: StaticId<T>,
      provider: Provider1<T, P0>,
      arg0: StaticId<P0>): void;
  registerProvider<T, P0, P1>(
      staticId: StaticId<T>,
      provider: Provider2<T, P0, P1>,
      arg0: StaticId<P0>,
      arg1: StaticId<P1>): void;

  registerProvider<T>(
      instanceId: InstanceId<T>,
      provider: Provider0<T>): void;
  registerProvider<T, P0>(
      instanceId: InstanceId<T>,
      provider: Provider1<T, P0>,
      arg0: NodeId<P0>): void;
  registerProvider<T, P0, P1>(
      instanceId: InstanceId<T>,
      provider: Provider2<T, P0, P1>,
      arg0: NodeId<P0>,
      arg1: NodeId<P1>): void;

  registerProvider<T>(
      nodeId: NodeId<T>,
      provider: Provider<T>,
      ...args: NodeId<any>[]): void {
    this.registerGenericProvider_(nodeId, provider, ...args);
  }

  private set_<T>(nodeId: NodeId<T>, context: {}, value: T): Promise<void> {
    Log.debug(LOGGER, `setting: ${nodeId} ${value}`);

    const node = this.nodes_.get(nodeId);
    if (!(node instanceof InputNode)) {
      throw new Error(`Node ${nodeId} is not an instance of InputNode. [${node}]`);
    }

    const promise = new Promise<void>((resolve: () => void) => {
      this.setQueue_.push(() => {
        Log.debug(LOGGER, `set flush: ${nodeId} ${value}`);
        const event = {context, id: nodeId, type: 'change' as 'change'};
        this.dispatch(event, () => {
          const newTime = this.currentTime_.increment();
          node.set(context, newTime, value);
          this.currentTime_ = newTime;
          if (nodeId instanceof StaticId) {
            this.refresh(nodeId);
          } else if (nodeId instanceof InstanceId) {
            this.refresh(nodeId, context);
          } else {
            assertUnreachable(nodeId);
          }
        });
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
