import { BaseDisposable, DisposableFunction } from '../dispose';
import { GLOBALS } from '../graph/g-node';
import { GraphEvent } from '../graph/graph-event';
import { InstanceId } from '../graph/instance-id';
import { NodeId } from '../graph/node-id';
import { StaticId } from '../graph/static-id';

type Handler<T, C> = (event: GraphEvent<T, C>) => any;

export class GraphEventHandler extends BaseDisposable {
  private readonly onChangeListeners_: WeakMap<{}, Map<NodeId<any>, Set<Handler<any, any>>>>
      = new WeakMap();
  private readonly onReadyListeners_: WeakMap<{}, Map<NodeId<any>, Set<Handler<any, any>>>>
      = new WeakMap();

  callHandlers_(
      listeners: WeakMap<{}, Map<NodeId<any>, Set<Handler<any, any>>>>,
      context: {},
      id: NodeId<any>,
      type: 'change' | 'ready'): void {
    const handlers = this.getHandlers_(listeners, context, id) || new Set<Handler<any, any>>();
    const event = {context, id, type};
    for (const handler of handlers) {
      handler(event);
    }
  }

  dispatchChange(id: StaticId<any>): void;
  dispatchChange(id: InstanceId<any>, context: {}): void;
  dispatchChange(id: NodeId<any>, context: {} = GLOBALS): void {
    this.callHandlers_(this.onChangeListeners_, context, id, 'change');
  }

  dispatchReady(id: StaticId<any>): void;
  dispatchReady(id: InstanceId<any>, context: {}): void;
  dispatchReady(id: NodeId<any>, context: {} = GLOBALS): void {
    this.callHandlers_(this.onReadyListeners_, context, id, 'ready');
  }

  getHandlers_(
      listeners: WeakMap<{}, Map<NodeId<any>, Set<Handler<any, any>>>>,
      context: {},
      id: NodeId<any>): Set<Handler<any, any>> | null {
    const map = listeners.get(context);
    if (!map) {
      return null;
    }

    return map.get(id) || null;
  }

  modifyHandlers_(
      listeners: WeakMap<{}, Map<NodeId<any>, Set<Handler<any, any>>>>,
      context: {},
      id: NodeId<any>,
      fn: (handlers: Set<Handler<any, any>>) => void): void {
    const map = listeners.get(context) || new Map<NodeId<any>, Set<Handler<any, any>>>();
    const handlers = map.get(id) || new Set();
    fn(handlers);

    if (handlers.size > 0) {
      map.set(id, handlers);
    } else {
      map.delete(id);
    }

    if (map.size > 0) {
      listeners.set(context, map);
    } else {
      listeners.delete(context);
    }
  }

  onChange<C>(id: StaticId<any>, handler: Handler<any, C>): DisposableFunction;
  onChange<C>(id: InstanceId<any>, handler: Handler<any, C>, context: C): DisposableFunction;
  onChange(id: NodeId<any>, handler: Handler<any, any>, context: {} = GLOBALS): DisposableFunction {
    this.modifyHandlers_(this.onChangeListeners_, context, id, (handlers) => handlers.add(handler));

    return DisposableFunction.of(() => {
      this.modifyHandlers_(
          this.onChangeListeners_,
          context,
          id,
          (handlers) => handlers.delete(handler));
    });
  }

  onReady<C>(id: StaticId<any>, handler: Handler<any, C>): DisposableFunction;
  onReady<C>(id: InstanceId<any>, handler: Handler<any, C>, context: C): DisposableFunction;
  onReady(id: NodeId<any>, handler: Handler<any, any>, context: {} = GLOBALS): DisposableFunction {
    this.modifyHandlers_(this.onReadyListeners_, context, id, (handlers) => handlers.add(handler));

    return DisposableFunction.of(() => {
      this.modifyHandlers_(
          this.onReadyListeners_,
          context,
          id,
          (handlers) => handlers.delete(handler));
    });
  }
}
