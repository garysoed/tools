import BaseListenable from '../event/base-listenable';
import ListenableElement, { EventType } from '../event/listenable-element';


export default class BaseService<EventType> extends BaseListenable<EventType> {
  constructor(window: Window) {
    super();

    let listenableWindow = new ListenableElement(window);
    this.addDisposable(listenableWindow);

    this.addDisposable(
        listenableWindow.on(EventType.BEFOREUNLOAD, this.onBeforeUnload_.bind(this)));
  }

  private onBeforeUnload_(): void {
    this.dispose();
  }
}
