import {assert, Matchers, TestBase} from '../test-base';
TestBase.setup();

import Asyncs from '../async/asyncs';
import {DomEvent} from '../event/dom-event';
import {Mocks} from '../mock/mocks';
import PostMessageChannel, {Message, MessageType} from './post-message-channel';
import Serializer from '../data/a-serializable';
import {TestDispose} from '../testing/test-dispose';


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
      let origin = 'origin';
      let message = new Message(MessageType.PING, { 'id': 123 });
      let json = Mocks.object('json');

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
          let origin = 'origin';
          let testFn = jasmine.createSpy('testFn').and.callFake((data: gs.IJson) => {
            return data['value'];
          });
          let message1 = { 'value': false };
          let message2 = { 'value': true };
          let json1 = Mocks.object('json1');
          let json2 = Mocks.object('json2');

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

          let mockDisposableFunction = jasmine.createSpyObj('DisposableFunction', ['dispose']);
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
              .to.haveBeenCalledWith(DomEvent.MESSAGE, <any> Matchers.any(Function));

          channel['srcWindow_'].on.calls.argsFor(0)[1]({data: json1, origin: origin});
          channel['srcWindow_'].on.calls.argsFor(0)[1]({data: json2, origin: origin});
        });

    it('should ignore messages with non matching origin',
        (done: any) => {
          let origin = 'origin';
          let testFn = jasmine.createSpy('testFn').and.callFake((data: gs.IJson) => {
            return data['value'];
          });
          let message1 = { 'value': false };
          let message2 = { 'value': true };
          let json1 = Mocks.object('json1');
          let json2 = Mocks.object('json2');

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

          let mockDisposableFunction = jasmine.createSpyObj('DisposableFunction', ['dispose']);
          spyOn(channel['srcWindow_'], 'on').and.returnValue(mockDisposableFunction);

          channel['waitForMessage_'](testFn)
              .then(() => {
                assert(testFn).toNot.haveBeenCalledWith(message1);
                done();
              }, done.fail);

          assert(channel['srcWindow_'].on)
              .to.haveBeenCalledWith(DomEvent.MESSAGE, <any> Matchers.any(Function));

          channel['srcWindow_'].on.calls.argsFor(0)[1]({data: json1, origin: 'otherOrigin'});
          channel['srcWindow_'].on.calls.argsFor(0)[1]({data: json2, origin: origin});
    });
  });

  describe('post', () => {
    it('should call post_ correctly', () => {
      let message = Mocks.object('message');

      spyOn(channel, 'post_');

      channel.post(message);

      assert(channel['post_']).to.haveBeenCalledWith(<any> Matchers.any(Message));

      let systemMessage = channel['post_'].calls.argsFor(0)[0];
      assert(systemMessage.getType()).to.equal(MessageType.DATA);
      assert(systemMessage.getPayload()).to.equal(message);
    });
  });

  describe('waitForMessage', () => {
    it('should return the payload returned by waitForMessage_', (done: any) => {
      let testFn = jasmine.createSpy('testFn');
      let returnedJson = Mocks.object('returnedJson');
      let message = new Message(MessageType.DATA, returnedJson);

      spyOn(channel, 'waitForMessage_').and.returnValue(Promise.resolve(message));

      channel.waitForMessage(testFn)
          .then((json: gs.IJson) => {
            assert(json).to.equal(returnedJson);
            done();
          }, done.fail);
    });

    it('should call the testFn for testing', (done: any) => {
      let testFn = jasmine.createSpy('testFn').and.returnValue(true);
      let testPayload = Mocks.object('payload');
      let testMessage = new Message(MessageType.DATA, testPayload);

      spyOn(channel, 'waitForMessage_').and.returnValue(Promise.resolve(testMessage));

      channel.waitForMessage(testFn)
          .then(() => {
            assert(<boolean> channel['waitForMessage_'].calls.argsFor(0)[0](testMessage))
                .to.beTrue();
            assert(testFn).to.haveBeenCalledWith(testPayload);
            done();
          }, done.fail);
    });

    it('should ignore message with message type other than DATA', (done: any) => {
      let testFn = jasmine.createSpy('testFn').and.returnValue(true);
      let testPayload = Mocks.object('payload');
      let testMessage = new Message(MessageType.PING, testPayload);

      spyOn(channel, 'waitForMessage_').and.returnValue(Promise.resolve(testMessage));

      channel.waitForMessage(testFn)
          .then(() => {
            assert(<boolean> channel['waitForMessage_'].calls.argsFor(0)[0](testMessage))
                .to.beFalse();
            done();
          }, done.fail);
    });
  });

  describe('getOrigin', () => {
    it('should return the correct URL', () => {
      let protocol = 'protocol';
      let host = 'host';

      let mockWindow = Mocks.object('window');
      mockWindow.location = { host: host, protocol: protocol };
      assert(PostMessageChannel.getOrigin(mockWindow))
          .to.equal(`${protocol}//${host}`);
    });
  });

  describe('open', () => {
    it('should return the channel object when established', (done: any) => {
      let id = 123;
      let intervalId = 456;
      let mockChannel = jasmine.createSpyObj('Channel', ['post_', 'waitForMessage_']);
      mockChannel['waitForMessage_'].and.returnValue(Promise.resolve());

      spyOn(PostMessageChannel, 'newInstance_').and.returnValue(mockChannel);
      spyOn(Math, 'random').and.returnValue(id);

      let setIntervalSpy = spyOn(window, 'setInterval').and.returnValue(intervalId);
      spyOn(window, 'clearInterval');

      PostMessageChannel
          .open(mockSrcWindow, mockDestWindow)
          .then((channel: PostMessageChannel) => {
            assert(channel).to.equal(mockChannel);
            assert(PostMessageChannel['newInstance_'])
                .to.haveBeenCalledWith(mockSrcWindow, mockDestWindow);

            let message = new Message(MessageType.ACK, { 'id': id });
            assert(<boolean> mockChannel['waitForMessage_'].calls.argsFor(0)[0](message))
                .to.beTrue();

            assert(window.setInterval)
                .to.haveBeenCalledWith(Matchers.any(Function), Matchers.any(Number));

            setIntervalSpy.calls.argsFor(0)[0]();
            assert(mockChannel.post_).to.haveBeenCalledWith(Matchers.any(Message));

            let postMessage = mockChannel.post_.calls.argsFor(0)[0];
            assert(postMessage.getType()).to.equal(MessageType.PING);
            assert(postMessage.getPayload()).to.equal({ 'id': id });

            // Check that the interval is cleared.
            assert(window.clearInterval).to.haveBeenCalledWith(intervalId);
            done();
          }, done.fail);
    });

    it('should ignore message if the ID does not match', (done: any) => {
      let id = 123;
      let mockChannel = jasmine.createSpyObj('Channel', ['post', 'waitForMessage_']);
      mockChannel['waitForMessage_'].and.returnValue(Promise.resolve());

      spyOn(PostMessageChannel, 'newInstance_').and.returnValue(mockChannel);

      spyOn(Math, 'random').and.returnValue(id);

      PostMessageChannel
          .open(mockSrcWindow, mockDestWindow)
          .then((channel: PostMessageChannel) => {
            let message = new Message(MessageType.ACK, { 'id': 456 });
            assert(<boolean> mockChannel['waitForMessage_'].calls.argsFor(0)[0](message))
                .to.beFalse();
            done();
          }, done.fail);
    });

    it('should ignore message if the message type is not ACK', (done: any) => {
      let id = 123;
      let mockChannel = jasmine.createSpyObj('Channel', ['post', 'waitForMessage_']);
      mockChannel['waitForMessage_'].and.returnValue(Promise.resolve());

      spyOn(PostMessageChannel, 'newInstance_').and.returnValue(mockChannel);

      spyOn(Math, 'random').and.returnValue(id);

      PostMessageChannel
          .open(mockSrcWindow, mockDestWindow)
          .then((channel: PostMessageChannel) => {
            let message = new Message(MessageType.PING, { 'id': id });
            assert(<boolean> mockChannel['waitForMessage_'].calls.argsFor(0)[0](message))
                .to.beFalse();
            done();
          }, done.fail);
    });
  });

  describe('listen', () => {
    it('should return the channel object when established and respond correctly', (done: any) => {
      let id = 123;
      let timeoutId = 6780;
      let expectedOrigin = 'expectedOrigin';
      let mockChannel = jasmine.createSpyObj('Channel', ['post_']);

      spyOn(mockSrcWindow, 'addEventListener');
      spyOn(PostMessageChannel, 'newInstance_').and.returnValue(mockChannel);
      spyOn(window, 'clearTimeout');
      spyOn(window, 'setTimeout').and.returnValue(timeoutId);

      PostMessageChannel
          .listen(mockSrcWindow, expectedOrigin)
          .then((channel: PostMessageChannel) => {
            assert(channel).to.equal(mockChannel);

            assert(mockChannel.post_).to.haveBeenCalledWith(Matchers.any(Message));
            let postMessage = mockChannel.post_.calls.argsFor(0)[0];
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
      let expectedOrigin = 'expectedOrigin';
      let mockChannel = jasmine.createSpyObj('Channel', ['post']);

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
      let expectedOrigin = 'expectedOrigin';
      let mockChannel = jasmine.createSpyObj('Channel', ['post']);

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
