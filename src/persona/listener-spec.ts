import { Event } from '../interfaces';
import { Listener } from '../persona/listener';

export type ListenerSpec = {
  handler: (event: Event<any>) => any,
  listener: Listener<any>,
  useCapture: boolean,
};
