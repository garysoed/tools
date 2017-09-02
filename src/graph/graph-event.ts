import { NodeId } from '../graph/node-id';

// change: The value has changed
// ready: Some dependency has been updated and is ready to be reexecuted.
export type EventType = 'change' | 'ready';
export type GraphEvent<T, C> = {context: C | null, id: NodeId<T>, type: EventType};
