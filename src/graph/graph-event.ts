import { NodeId } from '../graph/node-id';

export type EventType = 'change';
export type GraphEvent<T, C> = {context: C | null, id: NodeId<T>, type: EventType};
