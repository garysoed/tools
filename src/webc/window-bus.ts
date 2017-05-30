import { Bus } from '../event/bus';
import { ListenableDom } from '../event/listenable-dom';
import { DisposableFunction } from '../interfaces/disposable-function';
import { Log } from '../util/log';

export class WindowBus extends Bus<string, {type: string}> {
  private readonly listenableWindow_: ListenableDom<Window>;
  private readonly listenedEvents_: Set<string> = new Set();

  constructor(window: Window, log: Log) {
    super(log);
    this.listenableWindow_ = ListenableDom.of(window);
    this.addDisposable(this.listenableWindow_);
  }

  on(
      eventType: string,
      callback: (payload?: any) => void,
      context: Object,
      useCapture: boolean = false): DisposableFunction {
    if (!this.listenedEvents_.has(eventType)) {
      this.addDisposable(this.listenableWindow_.on(
          eventType,
          () => {
            this.dispatch({type: eventType});
          },
          this));
      this.listenedEvents_.add(eventType);
    }
    return super.on(eventType, callback, context, useCapture);
  }
}
