// import { assert, Matchers, TestBase } from '@gs-testing/main';
//

// import { Mocks } from '../mock/mocks';
// import { ApiClient } from '../rpc/api-client';


// describe('rpc.ApiClient', () => {
//   let mockChannel: any;
//   let mockResponseCheck: any;
//   let mockResponseType: any;
//   let client: ApiClient<any, any>;

//   beforeEach(() => {
//     mockChannel = createSpyObject('Channel', ['post', 'waitForMessage']);
//     mockResponseCheck = createSpy('ResponseCheck');
//     mockResponseType = createSpyObject('ResponseType', ['check']);
//     client = new ApiClient(mockChannel, mockResponseCheck, mockResponseType);
//   });

//   describe('onMessage_', () => {
//     should('return true if the message the correct type and response', () => {
//       const request = mocks.object('request');
//       const message = mocks.object('message');

//       mockResponseType.check.and.returnValue(true);
//       mockResponseCheck.and.returnValue(true);

//       assert(client['onMessage_'](request, message)).to.beTrue();
//       assert(mockResponseType.check).to.haveBeenCalledWith(message);
//       assert(mockResponseCheck).to.haveBeenCalledWith(request, message);
//     });

//     should('return false if the message is the correct type but wrong response', () => {
//       const request = mocks.object('request');
//       const message = mocks.object('message');

//       mockResponseType.check.and.returnValue(true);
//       mockResponseCheck.and.returnValue(false);

//       assert(client['onMessage_'](request, message)).to.beFalse();
//       assert(mockResponseType.check).to.haveBeenCalledWith(message);
//       assert(mockResponseCheck).to.haveBeenCalledWith(request, message);
//     });

//     should('return false if the message is the wrong type', () => {
//       const request = mocks.object('request');
//       const message = mocks.object('message');

//       mockResponseType.check.and.returnValue(false);
//       mockResponseCheck.and.returnValue(true);

//       assert(client['onMessage_'](request, message)).to.beFalse();
//       assert(mockResponseType.check).to.haveBeenCalledWith(message);
//     });
//   });

//   describe('post', () => {
//     should('post the request, wait for message and return the correct response', async () => {
//       const request = mocks.object('request');
//       spy(client, 'onMessage_');

//       const response = mocks.object('response');
//       mockChannel.waitForMessage.and.returnValue(Promise.resolve(response));
//       mockResponseType.check.and.returnValue(true);

//       assert(await client.post(request)).to.equal(response);
//       assert(mockResponseType.check).to.haveBeenCalledWith(response);

//       assert(mockChannel.waitForMessage).to.haveBeenCalledWith(Matchers.anyFunction());

//       const message = mocks.object('message');
//       mockChannel.waitForMessage.calls.argsFor(0)[0](message);
//       assert(client['onMessage_']).to.haveBeenCalledWith(request, message);
//       assert(mockChannel.post).to.haveBeenCalledWith(request);
//     });

//     should('reject if the response type is incorrect', async () => {
//       const request = mocks.object('request');
//       spy(client, 'onMessage_');

//       const response = mocks.object('response');
//       mockChannel.waitForMessage.and.returnValue(Promise.resolve(response));
//       mockResponseType.check.and.returnValue(false);

//       await assert(client.post(request)).to.rejectWithError(/inconsistent type/);
//       assert(mockResponseType.check).to.haveBeenCalledWith(response);
//     });
//   });
// });
