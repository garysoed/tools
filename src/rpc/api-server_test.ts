// import { assert, Matchers, TestBase } from 'gs-testing/export/main';
//

// import { Mocks } from '../mock/mocks';
// import { ApiServer } from '../rpc/api-server';


// describe('rpc.ApiServer', () => {
//   let mockChannel: any;
//   let mockProcessRequest: any;
//   let mockRequestType: any;
//   let server: ApiServer<any, any>;

//   beforeEach(() => {
//     mockChannel = createSpyObject('Channel', ['post', 'waitForMessage']);
//     mockProcessRequest = createSpy('ProcessRequest');
//     mockRequestType = createSpyObject('RequestType', ['check']);
//     server = new ApiServer(mockChannel, mockProcessRequest, mockRequestType);
//   });

//   describe('onMessage_', () => {
//     should('post the response correctly', () => {
//       const message = mocks.object('message');
//       mockRequestType.check.and.returnValue(true);

//       const response = mocks.object('response');
//       const mockPromise = createSpyObject('Promise', ['then']);
//       mockProcessRequest.and.returnValue(mockPromise);

//       assert(server['onMessage_'](message)).to.beFalse();
//       assert(mockProcessRequest).to.haveBeenCalledWith(message);
//       assert(mockRequestType.check).to.haveBeenCalledWith(message);

//       assert(mockPromise.then).to.haveBeenCalledWith(Matchers.anyFunction());
//       mockPromise.then.calls.argsFor(0)[0](response);
//       assert(mockChannel.post).to.haveBeenCalledWith(response);
//     });

//     should('do nothing if the message is the wrong type', () => {
//       const message = mocks.object('message');
//       mockRequestType.check.and.returnValue(false);

//       assert(server['onMessage_'](message)).to.beFalse();
//       assert(mockChannel.post).toNot.haveBeenCalled();
//       assert(mockRequestType.check).to.haveBeenCalledWith(message);
//     });
//   });

//   describe('run', () => {
//     should('wait for the message', () => {
//       spyOn(server, 'onMessage_');
//       server.run();
//       assert(mockChannel.waitForMessage).to.haveBeenCalledWith(Matchers.anyFunction());

//       const message = mocks.object('message');
//       mockChannel.waitForMessage.calls.argsFor(0)[0](message);
//       assert(server['onMessage_']).to.haveBeenCalledWith(message);
//     });
//   });
// });
