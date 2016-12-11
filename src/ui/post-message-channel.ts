import Asyncs from '../async/asyncs';
import {BaseDisposable} from '../dispose/base-disposable';
import {DomEvent} from '../event/dom-event';
import {ListenableDom} from '../event/listenable-dom';
import {Field, Serializable, Serializer} from '../data/a-serializable';


/**
 * @hidden
 */
const TIMEOUT_MS_ = 3000;

export enum MessageType {
  ACK,
  DATA,
  PING,
}

@Serializable('message')
export class Message {
  @Field('type') private type_: MessageType;
  @Field('payload') private payload_: gs.IJson;

  constructor(type: MessageType, payload: gs.IJson) {
    this.payload_ = payload;
    this.type_ = type;
  }

  getPayload(): gs.IJson {
    return this.payload_;
  }

  getType(): MessageType {
    return this.type_;
  }
}

/**
 * Represents a Channel using window postMessage mechanism.
 *
 * Using this consists of four steps:
 *
 * 1.  First, we need to identify the initiating window and the initiatee window.
 * 1.  The initiator window identifies the initiatee window to send message to. It opens the channel
 *     using the [[open]] method.
 * 1.  The initiatee window needs to know the origin of the initiating window, through some side
 *     channel or some preagreed value. It opens the channel using the [[listen]] method.
 * 1.  Both the [[open]] and [[listen]] methods returns a Promise that will be resolved with the
 *     channel when the connection is open.
 *
 * To close the channel, just dispose it.
 *
 * For example, the initiating window can do:
 *
 * ```typescript
 * import PostMessageChannel './ui/post-message-channel';
 *
 * PostMessagChannel
 *     .open(window, iframeEl.contentWindow)
 *     .then((channel: PostMessageChannel) => {
 *       channel.post({ 'message': 'blah' });
 *     });
 * ```
 *
 * The other window does:
 *
 * ```typescript
 * import PostMessageChannel './ui/post-message-channel';
 *
 * PostMessageChannel
 *     .listen(window, 'http://expected.origin')
 *     .then((channel: PostMessageChannel) => {
 *       return channel.waitForMessage(() => true)
 *     })
 *     .then((data: gs.IJson) => {
 *       console.log(data.message);  // 'blah'
 *     });
 * ```
 */
class PostMessageChannel extends BaseDisposable {
  private destWindow_: ListenableDom<Window>;
  private srcWindow_: ListenableDom<Window>;

  /**
   * @param srcWindow The source window for the postMessage channel.
   * @param destWindwo The destination window for the postMessage channel.
   */
  constructor(srcWindow: Window, destWindow: Window) {
    super();
    this.destWindow_ = new ListenableDom<Window>(destWindow);
    this.srcWindow_ = new ListenableDom<Window>(srcWindow);

    this.addDisposable(this.destWindow_, this.srcWindow_);
  }

  private post_(message: Message): Promise<void> {
    return Asyncs.run(() => {
      this.destWindow_.getEventTarget().postMessage(
          Serializer.toJSON(message),
          PostMessageChannel.getOrigin(this.srcWindow_.getEventTarget()));
    });
  }

  private waitForMessage_(testFn: (message: Message) => boolean): Promise<Message> {
    let destWindowOrigin = PostMessageChannel.getOrigin(this.destWindow_.getEventTarget());
    return new Promise((resolve: Function) => {
      let unlistenFn = this.srcWindow_.on(
          DomEvent.MESSAGE,
          (event: any) => {
            if (event.origin !== destWindowOrigin) {
              return;
            }

            let message = Serializer.fromJSON(event.data);
            if (testFn(message)) {
              unlistenFn.dispose();
              resolve(message);
            }
          },
          this);
    });
  }

  /**
   * Posts message to the destination window.
   *
   * @param message The message JSON to be sent to the destination window.
   * @return The promise that will be resolved when the message has been sent to the destination
   *     window.
   */
  post(message: gs.IJson): Promise<void> {
    return this.post_(new Message(MessageType.DATA, message));
  }

  /**
   * Waits for a message from the destination window.
   *
   * This method takes in a testFn which determines if the message received is the message that the
   * caller is waiting for. Once the caller has determined that the message is the one it wants,
   * this method will resolve the promise it returns.
   *
   * @param testFn Function to determine if the message is the one that the caller wants. This
   *     function takes in the message object and should return true iff it is the message searched.
   * @return Promise that will be resolved with the message object after it is found.
   */
  waitForMessage(testFn: (message: gs.IJson) => boolean): Promise<gs.IJson> {
    return this.waitForMessage_((message: Message) => {
      return (message.getType() === MessageType.DATA) && testFn(message.getPayload());
    })
    .then((message: Message) => {
      return message.getPayload();
    });
  }

  private static newInstance_(srcWindow: Window, destWindow: Window): PostMessageChannel {
    return new PostMessageChannel(srcWindow, destWindow);
  }

  /**
   * Generates the origin URL of the given window.
   *
   * @param window Window object to generate the origin URL for.
   * @return The generated origin URL.
   */
  static getOrigin(window: Window): string {
    return `${window.location.protocol}//${window.location.host}`;
  }

  /**
   * Opens the channel as the initiating window.
   *
   * @param srcWindow The initiating window.
   * @param destWindow The window to talk to.
   * @return Promise that will be resolved with the channel object once the connection is
   *     established.
   */
  static open(srcWindow: Window, destWindow: Window): Promise<PostMessageChannel> {
    let id = Math.random();
    let channel = PostMessageChannel.newInstance_(srcWindow, destWindow);

    let intervalId = window.setInterval(() => {
      channel.post_(new Message(MessageType.PING, { id: id }));
    }, 1000);

    return channel
        .waitForMessage_((message: Message) => {
          return message.getPayload()['id'] === id && message.getType() === MessageType.ACK;
        })
        .then(() => {
          window.clearInterval(intervalId);
          return channel;
        });
  }

  /**
   * Listens for request to open the channel as the initiatee window.
   *
   * @param srcWindow The initiatee window.
   * @param expectedOrigin Expected origin URL of the initiating window. This has to match the
   *     value returned by [[getOrigin]] of the initiating window.
   * @return Promise that will be resolved with the channel object once the connection is
   *     established.
   */
  static listen(srcWindow: Window, expectedOrigin: string): Promise<PostMessageChannel> {
    let srcWindowListenable = new ListenableDom<Window>(srcWindow);
    return new Promise((resolve: Function, reject: Function) => {
      let unlistenFn: (BaseDisposable|null) = null;
      let timeoutId = window.setTimeout(() => {
        srcWindowListenable.dispose();
        unlistenFn!.dispose();
        reject('Timed out listening for channel initiation message');
      }, TIMEOUT_MS_);

      unlistenFn = srcWindowListenable.on(
        DomEvent.MESSAGE,
        (event: any) => {
          if (event.origin !== expectedOrigin) {
            return;
          }

          let message = Serializer.fromJSON(event.data);

          if (message.getType() === MessageType.PING) {
            let channel = PostMessageChannel.newInstance_(srcWindow, event.source);
            channel.post_(new Message(MessageType.ACK, message.getPayload()));
            srcWindowListenable.dispose();
            unlistenFn!.dispose();
            window.clearTimeout(timeoutId);
            resolve(channel);
          }
        },
        this);
    });
  }
}

export default PostMessageChannel;
