import {BaseListenable} from '../event/base-listenable';
import {EventType, ListenableElement} from '../event/listenable-element';


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

    let listenableWindow = new ListenableElement(window);
    this.addDisposable(listenableWindow);

    this.addDisposable(
        listenableWindow.on(EventType.BEFOREUNLOAD, this.onBeforeUnload_.bind(this)));
  }

  private onBeforeUnload_(): void {
    this.dispose();
  }
}

export default BaseService;
