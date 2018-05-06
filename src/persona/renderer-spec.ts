import { NodeId } from '../graph';
import { Selector } from '../persona/selector';

export type RendererSpec = {parameters: Iterable<NodeId<any>>, selector: Selector<any>};
