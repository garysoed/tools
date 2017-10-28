import { BaseDisposable } from '../dispose';
import { GraphEvent } from '../graph/graph-event';
import { NodeId } from '../graph/node-id';

type Handler<T, C> = (event: GraphEvent<T, C>) => any;

export class GraphEventHandler extends BaseDisposable {
  private readonly onChangeListeners_: WeakMap<{}, Map<NodeId<any>, Set<Handler<any, any>>>>
      = new WeakMap();
  private readonly onReadyListeners_: WeakMap<{}, Map<NodeId<any>, Set<Handler<any, any>>>>
      = new WeakMap();

  private callHandlers_(
      listeners: WeakMap<{}, Map<NodeId<any>, Set<Handler<any, any>>>>,
      context: {},
      id: NodeId<any>,
      type: 'change' | 'ready'): void {
    const handlers = this.getHandler_(listeners, context, id) || new Set<Handler<any, any>>();
    const event = {context, id: id, type};
    for (const handler of handlers) {
      handler(event);
    }
  }

  dispatchChange(context: {}, id: NodeId<any>): void {
    this.callHandlers_(this.onChangeListeners_, context, id, 'change');
  }

  dispatchReady(context: {}, id: NodeId<any>): void {
    this.callHandlers_(this.onChangeListeners_, context, id, 'ready');
  }

  private getHandler_(
      listeners: WeakMap<{}, Map<NodeId<any>, Set<Handler<any, any>>>>,
      context: {},
      id: NodeId<any>): Set<Handler<any, any>> | null {
    const map = listeners.get(context);
    if (!map) {
      return null;
    }

    return map.get(id) || null;
  }

  private modifyHandlers_(
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

  onChange<C>(context: C, id: NodeId<any>, handler: Handler<any, C>): () => void {
    this.modifyHandlers_(this.onChangeListeners_, context, id, (handlers) => handlers.add(handler));

    return () => {
      this.modifyHandlers_(
          this.onChangeListeners_,
          context,
          id,
          (handlers) => handlers.delete(handler));
    };
  }

  onReady<C>(context: C, id: NodeId<any>, handler: Handler<any, C>): () => void {
    this.modifyHandlers_(this.onReadyListeners_, context, id, (handlers) => handlers.add(handler));

    return () => {
      this.modifyHandlers_(
          this.onReadyListeners_,
          context,
          id,
          (handlers) => handlers.delete(handler));
    };
  }
}
