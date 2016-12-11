import {BaseListenable} from '../event/base-listenable';
import {DomEvent} from '../event/dom-event';
import {ListenableDom} from '../event/listenable-dom';


/**
 * Base class for all Angular services.
 *
 * This sets the service as a [[BaseListenable]]. This class also listens for
 * `beforeunload` events to dispose itself.
 *
 * @param <E> The event type enum that this service can dispatch.
 */
class BaseService<E> extends BaseListenable<E> {
  /**
   * @param window Reference to the window object.
   */
  constructor(window: Window) {
    super();

    let listenableWindow = new ListenableDom(window);
    this.addDisposable(listenableWindow);

    this.addDisposable(
        listenableWindow.on(DomEvent.BEFOREUNLOAD, this.onBeforeUnload_, this));
  }

  private onBeforeUnload_(): void {
    this.dispose();
  }
}

export default BaseService;
