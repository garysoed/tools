import { InstanceId } from '../graph/instance-id';
import { StaticId } from '../graph/static-id';

export type NodeId<T> = StaticId<T> | InstanceId<T>;
