import { DisposableFunction } from '../dispose';
import { Listener } from '../persona/listener';

export class StubListener implements Listener<never> {
  start(): DisposableFunction {
    return DisposableFunction.of(() => undefined);
  }
}
