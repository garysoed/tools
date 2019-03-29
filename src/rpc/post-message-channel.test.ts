// import { assert, Matchers, TestBase } from '@gs-testing/main';
//

// import { Serializer } from '../data/a-serializable';
// import { DomEvent } from '../event/dom-event';
// import { Fakes } from '../mock/fakes';
// import { Mocks } from '../mock/mocks';
// import { Message, MessageType, PostMessageChannel } from '../rpc/post-message-channel';
// import { TestDispose } from '../testing/test-dispose';


// describe('rpc.PostMessageChannel', () => {
//   let mockDestWindow: any;
//   let mockSrcWindow: any;
//   let channel: PostMessageChannel;

//   beforeEach(() => {
//     mockDestWindow = createSpyObject('DestWindow', ['postMessage']);
//     mockSrcWindow = createSpyObject('SrcWindow', ['addEventListener', 'removeEventListener']);
//     channel = new PostMessageChannel(mockSrcWindow, mockDestWindow);
//     TestDispose.add(channel);
//   });

//   describe('post_', () => {
//     should('post the message asynchronously', () => {
//       const origin = 'origin';
//       const message = new Message(MessageType.PING, { 'id': 123 });
//       const json = mocks.object('json');

//       spy(PostMessageChannel, 'getOrigin').and.returnValue(origin);
//       spy(Serializer, 'toJSON').and.returnValue(json);

//       channel['post_'](message);

//       assert(mockDestWindow.postMessage).to.haveBeenCalledWith(json, origin);
//       assert(PostMessageChannel.getOrigin).to.haveBeenCalledWith(mockSrcWindow);
//       assert(Serializer.toJSON).to.haveBeenCalledWith(message);
//     });
//   });

//   describe('waitForMessage_', () => {
//     should('keep waiting for the test function to return true before resolving', async () => {
//       const origin = 'origin';
//       const testFn = Fakes.build(createSpy('testFn'))
//           .call((data: gs.IJson) => data['value']);
//       const message1 = { 'value': false };
//       const message2 = { 'value': true };
//       const json1 = mocks.object('json1');
//       const json2 = mocks.object('json2');

//       spy(PostMessageChannel, 'getOrigin').and.returnValue(origin);
//       Fakes.build(spy(Serializer, 'fromJSON'))
//           .when(json1).return(message1)
//           .when(json2).return(message2)
//           .else().return(null);

//       const mockDisposableFunction = createSpyObject('DisposableFunction', ['dispose']);
//       const listenToSpy = spy(channel, 'listenTo').and.returnValue(mockDisposableFunction);

//       const promise = channel['waitForMessage_'](testFn);

//       assert(channel.listenTo).to.haveBeenCalledWith(
//             channel['srcWindow_'], DomEvent.MESSAGE, Matchers.anyFunction());

//       listenToSpy.calls.argsFor(0)[2]({data: json1, origin: origin});
//       listenToSpy.calls.argsFor(0)[2]({data: json2, origin: origin});

//       const message = await promise;
//       assert(message).to.equal(message2);
//       assert(testFn).to.haveBeenCalledWith(message1);
//       assert(testFn).to.haveBeenCalledWith(message2);

//       assert(PostMessageChannel.getOrigin).to.haveBeenCalledWith(mockDestWindow);
//       assert(mockDisposableFunction.dispose).to.haveBeenCalledWith();
//     });

//     should('ignore messages with non matching origin', async () => {
//       const origin = 'origin';
//       const testFn = Fakes.build(createSpy('testFn'))
//           .call((data: gs.IJson) => data['value']);
//       const message1 = { 'value': false };
//       const message2 = { 'value': true };
//       const json1 = mocks.object('json1');
//       const json2 = mocks.object('json2');

//       spy(PostMessageChannel, 'getOrigin').and.returnValue(origin);
//       Fakes.build(spy(Serializer, 'fromJSON'))
//           .when(json1).return(message1)
//           .when(json2).return(message2)
//           .else().return(null);

//       const mockDisposableFunction = createSpyObject('DisposableFunction', ['dispose']);
//       const listenToSpy = spy(channel, 'listenTo').and.returnValue(mockDisposableFunction);

//       const promise = channel['waitForMessage_'](testFn);

//       assert(channel.listenTo).to.haveBeenCalledWith(
//           channel['srcWindow_'], DomEvent.MESSAGE, Matchers.anyFunction());

//       listenToSpy.calls.argsFor(0)[2]({data: json1, origin: 'otherOrigin'});
//       listenToSpy.calls.argsFor(0)[2]({data: json2, origin: origin});

//       await promise;
//       assert(testFn).toNot.haveBeenCalledWith(message1);
//     });
//   });

//   describe('post', () => {
//     should('call post_ correctly', () => {
//       const message = mocks.object('message');

//       const postSpy = spy(channel, 'post_');

//       channel.post(message);

//       assert(channel['post_']).to.haveBeenCalledWith(Matchers.any(Message) as any);

//       const systemMessage = postSpy.calls.argsFor(0)[0];
//       assert(systemMessage.getType()).to.equal(MessageType.DATA);
//       assert(systemMessage.getPayload()).to.equal(message);
//     });
//   });

//   describe('waitForMessage', () => {
//     should('return the payload returned by waitForMessage_', async () => {
//       const testFn = createSpy('testFn');
//       const returnedJson = mocks.object('returnedJson');
//       const message = new Message(MessageType.DATA, returnedJson);

//       spy(channel, 'waitForMessage_').and.returnValue(Promise.resolve(message));

//       const json = await channel.waitForMessage(testFn);
//       assert(json).to.equal(returnedJson);
//     });

//     should('call the testFn for testing', async () => {
//       const testFn = createSpy('testFn').and.returnValue(true);
//       const testPayload = mocks.object('payload');
//       const testMessage = new Message(MessageType.DATA, testPayload);

//       const waitSpy = spy(channel, 'waitForMessage_')
//           .and.returnValue(Promise.resolve(testMessage));

//       await channel.waitForMessage(testFn);
//       assert(waitSpy.calls.argsFor(0)[0](testMessage) as boolean).to.beTrue();
//       assert(testFn).to.haveBeenCalledWith(testPayload);
//     });

//     should('ignore message with message type other than DATA', async () => {
//       const testFn = createSpy('testFn').and.returnValue(true);
//       const testPayload = mocks.object('payload');
//       const testMessage = new Message(MessageType.PING, testPayload);

//       const waitSpy = spy(channel, 'waitForMessage_').and
//           .returnValue(Promise.resolve(testMessage));

//       await channel.waitForMessage(testFn);
//       assert(waitSpy.calls.argsFor(0)[0](testMessage) as boolean)
//           .to.beFalse();
//     });
//   });

//   describe('getOrigin', () => {
//     should('return the correct URL', () => {
//       const protocol = 'protocol';
//       const host = 'host';

//       const mockWindow = mocks.object('window');
//       mockWindow.location = { host: host, protocol: protocol };
//       assert(PostMessageChannel.getOrigin(mockWindow))
//           .to.equal(`${protocol}//${host}`);
//     });
//   });

//   describe('open', () => {
//     should('return the channel object when established', async () => {
//       const id = 123;
//       const intervalId = 456;
//       const mockChannel = createSpyObject('Channel', ['post_', 'waitForMessage_']);
//       mockChannel['waitForMessage_'].and.returnValue(Promise.resolve());

//       spy(PostMessageChannel, 'of_').and.returnValue(mockChannel);
//       spy(Math, 'random').and.returnValue(id);

//       const setIntervalSpy = spy(window, 'setInterval').and.returnValue(intervalId);
//       spy(window, 'clearInterval');

//       const channel = await PostMessageChannel.open(mockSrcWindow, mockDestWindow);
//       assert(channel).to.equal(mockChannel);
//       assert(PostMessageChannel['of_'])
//           .to.haveBeenCalledWith(mockSrcWindow, mockDestWindow);

//       const message = new Message(MessageType.ACK, { 'id': id });
//       assert(mockChannel['waitForMessage_'].calls.argsFor(0)[0](message) as boolean)
//           .to.beTrue();

//       assert(window.setInterval)
//           .to.haveBeenCalledWith(Matchers.anyFunction(), Matchers.any(Number));

//       setIntervalSpy.calls.argsFor(0)[0]();
//       assert(mockChannel.post_).to.haveBeenCalledWith(Matchers.any(Message));

//       const postMessage = mockChannel.post_.calls.argsFor(0)[0];
//       assert(postMessage.getType()).to.equal(MessageType.PING);
//       assert(postMessage.getPayload()).to.equal({ id: id });

//       // Check that the interval is cleared.
//       assert(window.clearInterval).to.haveBeenCalledWith(intervalId);
//     });

//     should('ignore message if the ID does not match', async () => {
//       const id = 123;
//       const mockChannel = createSpyObject('Channel', ['post', 'waitForMessage_']);
//       mockChannel['waitForMessage_'].and.returnValue(Promise.resolve());

//       spy(PostMessageChannel, 'of_').and.returnValue(mockChannel);

//       spy(Math, 'random').and.returnValue(id);

//       await PostMessageChannel.open(mockSrcWindow, mockDestWindow);
//       const message = new Message(MessageType.ACK, { id: 456 });
//       assert(mockChannel['waitForMessage_'].calls.argsFor(0)[0](message) as boolean)
//           .to.beFalse();
//     });

//     should('ignore message if the message type is not ACK', async () => {
//       const id = 123;
//       const mockChannel = createSpyObject('Channel', ['post', 'waitForMessage_']);
//       mockChannel['waitForMessage_'].and.returnValue(Promise.resolve());

//       spy(PostMessageChannel, 'of_').and.returnValue(mockChannel);

//       spy(Math, 'random').and.returnValue(id);

//       await PostMessageChannel.open(mockSrcWindow, mockDestWindow);
//       const message = new Message(MessageType.PING, { id });
//       assert(mockChannel['waitForMessage_'].calls.argsFor(0)[0](message) as boolean).to.beFalse();
//     });
//   });

//   describe('listen', () => {
//     should('return the channel object when established and respond correctly', async () => {
//       const id = 123;
//       const timeoutId = 6780;
//       const expectedOrigin = 'expectedOrigin';
//       const mockChannel = createSpyObject('Channel', ['post_']);

//       spy(PostMessageChannel, 'of_').and.returnValue(mockChannel);
//       spy(window, 'clearTimeout');
//       spy(window, 'setTimeout').and.returnValue(timeoutId);

//       const promise = PostMessageChannel.listen(mockSrcWindow, expectedOrigin);

//       assert(mockSrcWindow.addEventListener)
//           .to.haveBeenCalledWith('message', Matchers.anyFunction(), false);
//       mockSrcWindow.addEventListener.calls.argsFor(0)[1]({
//         data: Serializer.toJSON(new Message(MessageType.PING, { id })),
//         getType: () => 'message',
//         origin: expectedOrigin,
//         source: mockDestWindow,
//       });

//       const channel = await promise;
//       assert(channel).to.equal(mockChannel);

//       assert(mockChannel.post_).to.haveBeenCalledWith(Matchers.any(Message));
//       const postMessage = mockChannel.post_.calls.argsFor(0)[0];
//       assert(postMessage.getType()).to.equal(MessageType.ACK);
//       assert(postMessage.getPayload()).to.equal({ id });

//       assert(PostMessageChannel['of_'])
//           .to.haveBeenCalledWith(mockSrcWindow, mockDestWindow);

//       assert(window.setTimeout)
//           .to.haveBeenCalledWith(Matchers.anyFunction(), Matchers.any(Number));
//       assert(window.clearTimeout).to.haveBeenCalledWith(timeoutId);
//     });

//     should('ignore message if the origin does not match', async () => {
//       const expectedOrigin = 'expectedOrigin';
//       const mockChannel = createSpyObject('Channel', ['post']);

//       spy(PostMessageChannel, 'of_').and.returnValue(mockChannel);

//       const promise = PostMessageChannel.listen(mockSrcWindow, expectedOrigin);
//       mockSrcWindow.addEventListener.calls.argsFor(0)[1]({
//         data: {
//           id: 123,
//           type: 'PING',
//         },
//         origin: 'otherOrigin',
//         source: mockDestWindow,
//         type: 'message',
//       });

//       await assert(promise).to.reject();
//     });

//     should('ignore message if the type is not PING', async () => {
//       const expectedOrigin = 'expectedOrigin';
//       const mockChannel = createSpyObject('Channel', ['post']);

//       spy(PostMessageChannel, 'of_').and.returnValue(mockChannel);

//       const promise = PostMessageChannel.listen(mockSrcWindow, expectedOrigin);

//       mockSrcWindow.addEventListener.calls.argsFor(0)[1]({
//         data: Serializer.toJSON(new Message(MessageType.DATA, {})),
//         origin: expectedOrigin,
//         source: mockDestWindow,
//         type: 'message',
//       });

//       await assert(promise).to.reject();
//     });
//   });
// });
