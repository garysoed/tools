import { IType } from '../check/i-type';
import { PostMessageChannel } from '../rpc/post-message-channel';


/**
 * Server endpoint for an API.
 * @param <Q> Type of the request to handle.
 * @param <P> Type of the response to return.
 */
export class ApiServer<Q, P extends gs.IJson> {
  private readonly channel_: PostMessageChannel;
  private readonly processRequest_: (request: Q) => Promise<P>;
  private readonly requestType_: IType<Q>;

  constructor(
      channel: PostMessageChannel,
      processRequest: (request: Q) => Promise<P>,
      requestType: IType<Q>) {
    this.channel_ = channel;
    this.processRequest_ = processRequest;
    this.requestType_ = requestType;
  }

  private onMessage_(message: gs.IJson): boolean {
    if (this.requestType_.check(message)) {
      this.processRequest_(message)
          .then((response: P) => {
            this.channel_.post(response);
          });
    }
    return false;
  }

  /**
   * Runs the server.
   */
  run(): void {
    this.channel_.waitForMessage(this.onMessage_.bind(this));
  }

  /**
   * Creates a new instance of the ApiServer.
   * @param channel Channel to communicate the API through.
   * @param processRequest Function that takes the request and returns promise that will be resolved
   *    with the corresponding response..
   * @param requestType Type check for the request.
   * @return New instance of the ApiServer.
   */
  static of<Q, P extends gs.IJson>(
      channel: PostMessageChannel,
      processRequest: (request: Q) => Promise<P>,
      requestType: IType<Q>): ApiServer<Q, P> {
    return new ApiServer<Q, P>(channel, processRequest, requestType);
  }
}
// TODO: Mutable
