import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Asyncs } from '../async/asyncs';
import { Serializer } from '../data/a-serializable';
import { DomEvent } from '../event/dom-event';
import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';
import { Message, MessageType, PostMessageChannel } from '../ui/post-message-channel';


describe('ui.PostMessageChannel', () => {
  let mockDestWindow;
  let mockSrcWindow;
  let channel;

  beforeEach(() => {
    mockDestWindow = Mocks.element({});
    mockSrcWindow = Mocks.element({});
    channel = new PostMessageChannel(mockSrcWindow, mockDestWindow);
    TestDispose.add(channel);
  });

  describe('post_', () => {
    it('should post the message asynchronously', () => {
      const origin = 'origin';
      const message = new Message(MessageType.PING, { 'id': 123 });
      const json = Mocks.object('json');

      mockDestWindow.postMessage = jasmine.createSpy('postMessage');

      spyOn(PostMessageChannel, 'getOrigin').and.returnValue(origin);
      spyOn(Serializer, 'toJSON').and.returnValue(json);

      channel['post_'](message);

      assert(Asyncs.run).to.haveBeenCalledWith(<any> Matchers.any(Function));
      assert(mockDestWindow.postMessage).to.haveBeenCalledWith(json, origin);
      assert(PostMessageChannel.getOrigin).to.haveBeenCalledWith(mockSrcWindow);
      assert(Serializer.toJSON).to.haveBeenCalledWith(message);
    });
  });

  describe('waitForMessage_', () => {
    it('should keep waiting for the test function to return true before resolving',
        (done: any) => {
          const origin = 'origin';
          const testFn = jasmine.createSpy('testFn').and.callFake((data: gs.IJson) => {
            return data['value'];
          });
          const message1 = { 'value': false };
          const message2 = { 'value': true };
          const json1 = Mocks.object('json1');
          const json2 = Mocks.object('json2');

          spyOn(PostMessageChannel, 'getOrigin').and.returnValue(origin);
          spyOn(Serializer, 'fromJSON').and.callFake((json: any) => {
            switch (json) {
              case json1:
                return message1;
              case json2:
                return message2;
              default:
                return null;
            }
          });

          const mockDisposableFunction = jasmine.createSpyObj('DisposableFunction', ['dispose']);
          spyOn(channel['srcWindow_'], 'on').and.returnValue(mockDisposableFunction);

          channel['waitForMessage_'](testFn)
              .then((message: Message) => {
                assert(message).to.equal(message2);
                assert(testFn).to.haveBeenCalledWith(message1);
                assert(testFn).to.haveBeenCalledWith(message2);

                assert(PostMessageChannel.getOrigin).to.haveBeenCalledWith(mockDestWindow);
                assert(mockDisposableFunction.dispose).to.haveBeenCalledWith();
                done();
              }, done.fail);

          assert(channel['srcWindow_'].on)
              .to.haveBeenCalledWith(DomEvent.MESSAGE, Matchers.any(Function), channel);

          channel['srcWindow_'].on.calls.argsFor(0)[1]({data: json1, origin: origin});
          channel['srcWindow_'].on.calls.argsFor(0)[1]({data: json2, origin: origin});
        });

    it('should ignore messages with non matching origin',
        (done: any) => {
          const origin = 'origin';
          const testFn = jasmine.createSpy('testFn').and.callFake((data: gs.IJson) => {
            return data['value'];
          });
          const message1 = { 'value': false };
          const message2 = { 'value': true };
          const json1 = Mocks.object('json1');
          const json2 = Mocks.object('json2');

          spyOn(PostMessageChannel, 'getOrigin').and.returnValue(origin);
          spyOn(Serializer, 'fromJSON').and.callFake((json: any) => {
            switch (json) {
              case json1:
                return message1;
              case json2:
                return message2;
              default:
                return null;
            }
          });

          const mockDisposableFunction = jasmine.createSpyObj('DisposableFunction', ['dispose']);
          spyOn(channel['srcWindow_'], 'on').and.returnValue(mockDisposableFunction);

          channel['waitForMessage_'](testFn)
              .then(() => {
                assert(testFn).toNot.haveBeenCalledWith(message1);
                done();
              }, done.fail);

          assert(channel['srcWindow_'].on)
              .to.haveBeenCalledWith(DomEvent.MESSAGE, Matchers.any(Function), channel);

          channel['srcWindow_'].on.calls.argsFor(0)[1]({data: json1, origin: 'otherOrigin'});
          channel['srcWindow_'].on.calls.argsFor(0)[1]({data: json2, origin: origin});
    });
  });

  describe('post', () => {
    it('should call post_ correctly', () => {
      const message = Mocks.object('message');

      spyOn(channel, 'post_');

      channel.post(message);

      assert(channel['post_']).to.haveBeenCalledWith(<any> Matchers.any(Message));

      const systemMessage = channel['post_'].calls.argsFor(0)[0];
      assert(systemMessage.getType()).to.equal(MessageType.DATA);
      assert(systemMessage.getPayload()).to.equal(message);
    });
  });

  describe('waitForMessage', () => {
    it('should return the payload returned by waitForMessage_', async (done: any) => {
      const testFn = jasmine.createSpy('testFn');
      const returnedJson = Mocks.object('returnedJson');
      const message = new Message(MessageType.DATA, returnedJson);

      spyOn(channel, 'waitForMessage_').and.returnValue(Promise.resolve(message));

      const json = await channel.waitForMessage(testFn);
      assert(json).to.equal(returnedJson);
    });

    it('should call the testFn for testing', async (done: any) => {
      const testFn = jasmine.createSpy('testFn').and.returnValue(true);
      const testPayload = Mocks.object('payload');
      const testMessage = new Message(MessageType.DATA, testPayload);

      spyOn(channel, 'waitForMessage_').and.returnValue(Promise.resolve(testMessage));

      await channel.waitForMessage(testFn);
      assert(<boolean> channel['waitForMessage_'].calls.argsFor(0)[0](testMessage))
          .to.beTrue();
      assert(testFn).to.haveBeenCalledWith(testPayload);
    });

    it('should ignore message with message type other than DATA', async (done: any) => {
      const testFn = jasmine.createSpy('testFn').and.returnValue(true);
      const testPayload = Mocks.object('payload');
      const testMessage = new Message(MessageType.PING, testPayload);

      spyOn(channel, 'waitForMessage_').and.returnValue(Promise.resolve(testMessage));

      await channel.waitForMessage(testFn);
      assert(<boolean> channel['waitForMessage_'].calls.argsFor(0)[0](testMessage))
          .to.beFalse();
    });
  });

  describe('getOrigin', () => {
    it('should return the correct URL', () => {
      const protocol = 'protocol';
      const host = 'host';

      const mockWindow = Mocks.object('window');
      mockWindow.location = { host: host, protocol: protocol };
      assert(PostMessageChannel.getOrigin(mockWindow))
          .to.equal(`${protocol}//${host}`);
    });
  });

  describe('open', () => {
    it('should return the channel object when established', async (done: any) => {
      const id = 123;
      const intervalId = 456;
      const mockChannel = jasmine.createSpyObj('Channel', ['post_', 'waitForMessage_']);
      mockChannel['waitForMessage_'].and.returnValue(Promise.resolve());

      spyOn(PostMessageChannel, 'newInstance_').and.returnValue(mockChannel);
      spyOn(Math, 'random').and.returnValue(id);

      const setIntervalSpy = spyOn(window, 'setInterval').and.returnValue(intervalId);
      spyOn(window, 'clearInterval');

      const channel = await PostMessageChannel.open(mockSrcWindow, mockDestWindow);
      assert(channel).to.equal(mockChannel);
      assert(PostMessageChannel['newInstance_'])
          .to.haveBeenCalledWith(mockSrcWindow, mockDestWindow);

      const message = new Message(MessageType.ACK, { 'id': id });
      assert(<boolean> mockChannel['waitForMessage_'].calls.argsFor(0)[0](message))
          .to.beTrue();

      assert(window.setInterval)
          .to.haveBeenCalledWith(Matchers.any(Function), Matchers.any(Number));

      setIntervalSpy.calls.argsFor(0)[0]();
      assert(mockChannel.post_).to.haveBeenCalledWith(Matchers.any(Message));

      const postMessage = mockChannel.post_.calls.argsFor(0)[0];
      assert(postMessage.getType()).to.equal(MessageType.PING);
      assert(postMessage.getPayload()).to.equal({ 'id': id });

      // Check that the interval is cleared.
      assert(window.clearInterval).to.haveBeenCalledWith(intervalId);
    });

    it('should ignore message if the ID does not match', async (done: any) => {
      const id = 123;
      const mockChannel = jasmine.createSpyObj('Channel', ['post', 'waitForMessage_']);
      mockChannel['waitForMessage_'].and.returnValue(Promise.resolve());

      spyOn(PostMessageChannel, 'newInstance_').and.returnValue(mockChannel);

      spyOn(Math, 'random').and.returnValue(id);

      await PostMessageChannel.open(mockSrcWindow, mockDestWindow);
      const message = new Message(MessageType.ACK, { 'id': 456 });
      assert(<boolean> mockChannel['waitForMessage_'].calls.argsFor(0)[0](message))
          .to.beFalse();
    });

    it('should ignore message if the message type is not ACK', async (done: any) => {
      const id = 123;
      const mockChannel = jasmine.createSpyObj('Channel', ['post', 'waitForMessage_']);
      mockChannel['waitForMessage_'].and.returnValue(Promise.resolve());

      spyOn(PostMessageChannel, 'newInstance_').and.returnValue(mockChannel);

      spyOn(Math, 'random').and.returnValue(id);

      await PostMessageChannel.open(mockSrcWindow, mockDestWindow);
      const message = new Message(MessageType.PING, { 'id': id });
      assert(<boolean> mockChannel['waitForMessage_'].calls.argsFor(0)[0](message)).to.beFalse();
    });
  });

  describe('listen', () => {
    it('should return the channel object when established and respond correctly', (done: any) => {
      const id = 123;
      const timeoutId = 6780;
      const expectedOrigin = 'expectedOrigin';
      const mockChannel = jasmine.createSpyObj('Channel', ['post_']);

      spyOn(mockSrcWindow, 'addEventListener');
      spyOn(PostMessageChannel, 'newInstance_').and.returnValue(mockChannel);
      spyOn(window, 'clearTimeout');
      spyOn(window, 'setTimeout').and.returnValue(timeoutId);

      PostMessageChannel
          .listen(mockSrcWindow, expectedOrigin)
          .then((channel: PostMessageChannel) => {
            assert(channel).to.equal(mockChannel);

            assert(mockChannel.post_).to.haveBeenCalledWith(Matchers.any(Message));
            const postMessage = mockChannel.post_.calls.argsFor(0)[0];
            assert(postMessage.getType()).to.equal(MessageType.ACK);
            assert(postMessage.getPayload()).to.equal({ 'id': id });

            assert(PostMessageChannel['newInstance_'])
                .to.haveBeenCalledWith(mockSrcWindow, mockDestWindow);

            assert(window.setTimeout)
                .to.haveBeenCalledWith(Matchers.any(Function), Matchers.any(Number));
            assert(window.clearTimeout).to.haveBeenCalledWith(timeoutId);
            done();
          }, done.fail);

      assert(mockSrcWindow.addEventListener)
          .to.haveBeenCalledWith('message', Matchers.any(Function), false);
      mockSrcWindow.addEventListener.calls.argsFor(0)[1]({
        data: Serializer.toJSON(new Message(MessageType.PING, { 'id': id })),
        getType: () => 'message',
        origin: expectedOrigin,
        source: mockDestWindow,
      });
    });

    it('should ignore message if the origin does not match', (done: any) => {
      const expectedOrigin = 'expectedOrigin';
      const mockChannel = jasmine.createSpyObj('Channel', ['post']);

      spyOn(mockSrcWindow, 'addEventListener');
      spyOn(PostMessageChannel, 'newInstance_').and.returnValue(mockChannel);

      PostMessageChannel
          .listen(mockSrcWindow, expectedOrigin)
          .then(done.fail, done);

      mockSrcWindow.addEventListener.calls.argsFor(0)[1]({
        data: {
          'id': 123,
          'type': 'PING',
        },
        origin: 'otherOrigin',
        source: mockDestWindow,
        type: 'message',
      });
    });

    it('should ignore message if the type is not PING', (done: any) => {
      const expectedOrigin = 'expectedOrigin';
      const mockChannel = jasmine.createSpyObj('Channel', ['post']);

      spyOn(mockSrcWindow, 'addEventListener');
      spyOn(PostMessageChannel, 'newInstance_').and.returnValue(mockChannel);

      PostMessageChannel
          .listen(mockSrcWindow, expectedOrigin)
          .then(done.fail, done);

      mockSrcWindow.addEventListener.calls.argsFor(0)[1]({
        data: Serializer.toJSON(new Message(MessageType.DATA, {})),
        origin: expectedOrigin,
        source: mockDestWindow,
        type: 'message',
      });
    });
  });
});
