// import { Type } from '../check/type';
// import { PostMessageChannel } from '../rpc/post-message-channel';


// /**
//  * Client endpoint for accessing an API.
//  * @param <Q> Type of the request.
//  * @param <P> Type of the response.
//  */
// export class ApiClient<Q extends gs.IJson, P> {
//   private readonly channel_: PostMessageChannel;
//   private readonly responseCheck_: (request: Q, response: P) => boolean;
//   private readonly responseType_: Type<P>;

//   constructor(
//       channel: PostMessageChannel,
//       responseCheck: (request: Q, response: P) => boolean,
//       responseType: Type<P>) {
//     this.channel_ = channel;
//     this.responseCheck_ = responseCheck;
//     this.responseType_ = responseType;
//   }

//   onMessage_(request: Q, message: gs.IJson): boolean {
//     return this.responseType_.check(message) && this.responseCheck_(request, message);
//   }

//   /**
//    * Posts the given request.
//    * @param request The request to post.
//    * @return Promise that will be resolved with the response.
//    */
//   async post(request: Q): Promise<P> {
//     this.channel_.post(request);
//     const response = await this.channel_.waitForMessage(this.onMessage_.bind(this, request));
//     if (!this.responseType_.check(response)) {
//       throw new Error(`Response with inconsistent type found: ${JSON.stringify(response)}`);
//     }
//     return response;
//   }

//   /**
//    * Creates a new instance of the ApiClient.
//    * @param channel Channel to communicate the API through.
//    * @param responseCheck Function that takes the response object and should return true iff the
//    *     response corresponds to the request.
//    * @param responseType Type check for the response.
//    * @return New instance of the ApiClient.
//    */
//   static of<Q extends gs.IJson, P>(
//       channel: PostMessageChannel,
//       responseCheck: (request: Q, response: P) => boolean,
//       responseType: Type<P>): ApiClient<Q, P> {
//     return new ApiClient<Q, P>(channel, responseCheck, responseType);
//   }
// }
// // TODO: Mutable
