import TestBase from '../test-base';
TestBase.setup();

import Asyncs from '../async/asyncs';
import { EventType as ElementEventType } from '../event/listenable-element';
import Mocks from '../mock/mocks';
import PostMessageChannel, { Message_, MessageType_ } from './post-message-channel';
import Serializer from '../data/a-serializable';
import TestDispose from '../testing/test-dispose';


describe('ui.PostMessageChannel', () => {
  let mockDestWindow;
  let mockSrcWindow;
  let channel;

  beforeEach(() => {
    mockDestWindow = Mocks.element({});
    mockSrcWindow = Mocks.element({});
    channel = new PostMessageChannel(mockSrcWindow, mockDestWindow);
    TestDispose.add(channel);
  })

  describe('post_', () => {
    it('should post the message asynchronously', () => {
      let origin = 'origin';
      let message = new Message_(MessageType_.PING, { 'id': 123 });
      let json = Mocks.object('json');

      mockDestWindow.postMessage = jasmine.createSpy('postMessage');

      spyOn(PostMessageChannel, 'getOrigin').and.returnValue(origin);
      spyOn(Serializer, 'toJSON').and.returnValue(json);

      channel['post_'](message);

      expect(Asyncs.run).toHaveBeenCalledWith(jasmine.any(Function));
      expect(mockDestWindow.postMessage).toHaveBeenCalledWith(json, origin);
      expect(PostMessageChannel.getOrigin).toHaveBeenCalledWith(mockSrcWindow);
      expect(Serializer.toJSON).toHaveBeenCalledWith(message);
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

          channel['waitForMessage_'](testFn)
              .then((message: Message_) => {
                expect(message).toEqual(message2);
                expect(testFn).toHaveBeenCalledWith(message1);
                expect(testFn).toHaveBeenCalledWith(message2);

                expect(PostMessageChannel.getOrigin).toHaveBeenCalledWith(mockDestWindow);
                done();
              }, done.fail);

          channel['srcWindow_'].dispatch(
              ElementEventType.MESSAGE,
              { origin: origin, data: json1 });
          channel['srcWindow_'].dispatch(
              ElementEventType.MESSAGE,
              { origin: origin, data: json2 });
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

          channel['waitForMessage_'](testFn)
              .then(() => {
                expect(testFn).not.toHaveBeenCalledWith(message1);
                done();
              }, done.fail);

          channel['srcWindow_'].dispatch(
              ElementEventType.MESSAGE,
              { origin: 'otherOrigin', data: json1 });
          channel['srcWindow_'].dispatch(
              ElementEventType.MESSAGE,
              { origin: origin, data: json2 });
    });
  });

  describe('post', () => {
    it('should call post_ correctly', () => {
      let message = Mocks.object('message');

      spyOn(channel, 'post_');

      channel.post(message);

      expect(channel['post_']).toHaveBeenCalledWith(jasmine.any(Message_));

      let systemMessage = channel['post_'].calls.argsFor(0)[0];
      expect(systemMessage.type).toEqual(MessageType_.DATA);
      expect(systemMessage.payload).toEqual(message);
    });
  });

  describe('waitForMessage', () => {
    it('should return the payload returned by waitForMessage_', (done: any) => {
      let testFn = jasmine.createSpy('testFn');
      let returnedJson = Mocks.object('returnedJson');
      let message = new Message_(MessageType_.DATA, returnedJson);

      spyOn(channel, 'waitForMessage_').and.returnValue(Promise.resolve(message));

      channel.waitForMessage(testFn)
          .then((json: gs.IJson) => {
            expect(json).toEqual(returnedJson);
            done();
          }, done.fail);
    });

    it('should call the testFn for testing', (done: any) => {
      let testFn = jasmine.createSpy('testFn').and.returnValue(true);
      let testPayload = Mocks.object('payload');
      let testMessage = new Message_(MessageType_.DATA, testPayload);

      spyOn(channel, 'waitForMessage_').and.returnValue(Promise.resolve(testMessage));

      channel.waitForMessage(testFn)
          .then(() => {
            expect(channel['waitForMessage_'].calls.argsFor(0)[0](testMessage)).toEqual(true);
            expect(testFn).toHaveBeenCalledWith(testPayload);
            done();
          }, done.fail);
    });

    it('should ignore message with message type other than DATA', (done: any) => {
      let testFn = jasmine.createSpy('testFn').and.returnValue(true);
      let testPayload = Mocks.object('payload');
      let testMessage = new Message_(MessageType_.PING, testPayload);

      spyOn(channel, 'waitForMessage_').and.returnValue(Promise.resolve(testMessage));

      channel.waitForMessage(testFn)
          .then(() => {
            expect(channel['waitForMessage_'].calls.argsFor(0)[0](testMessage)).toEqual(false);
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
      expect(PostMessageChannel.getOrigin(mockWindow))
          .toEqual(`${protocol}//${host}`);
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
            expect(channel).toEqual(mockChannel);
            expect(PostMessageChannel['newInstance_'])
                .toHaveBeenCalledWith(mockSrcWindow, mockDestWindow);

            let message = new Message_(MessageType_.ACK, { 'id': id });
            expect(mockChannel['waitForMessage_'].calls.argsFor(0)[0](message)).toEqual(true);

            expect(window.setInterval)
                .toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Number));

            setIntervalSpy.calls.argsFor(0)[0]();
            expect(mockChannel.post_).toHaveBeenCalledWith(jasmine.any(Message_));

            let postMessage = mockChannel.post_.calls.argsFor(0)[0];
            expect(postMessage.type).toEqual(MessageType_.PING);
            expect(postMessage.payload).toEqual({ 'id': id });

            // Check that the interval is cleared.
            expect(window.clearInterval).toHaveBeenCalledWith(intervalId);
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
            let message = new Message_(MessageType_.ACK, { 'id': 456 });
            expect(mockChannel['waitForMessage_'].calls.argsFor(0)[0](message)).toEqual(false);
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
            let message = new Message_(MessageType_.PING, { 'id': id });
            expect(mockChannel['waitForMessage_'].calls.argsFor(0)[0](message))
                .toEqual(false);
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
            expect(channel).toEqual(mockChannel);

            expect(mockChannel.post_).toHaveBeenCalledWith(jasmine.any(Message_));
            let postMessage = mockChannel.post_.calls.argsFor(0)[0];
            expect(postMessage.type).toEqual(MessageType_.ACK);
            expect(postMessage.payload).toEqual({ 'id': id });

            expect(PostMessageChannel['newInstance_'])
                .toHaveBeenCalledWith(mockSrcWindow, mockDestWindow);

            expect(window.setTimeout)
                .toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Number));
            expect(window.clearTimeout).toHaveBeenCalledWith(timeoutId);
            done();
          }, done.fail);

      expect(mockSrcWindow.addEventListener).toHaveBeenCalledWith('message', jasmine.any(Function));
      mockSrcWindow.addEventListener.calls.argsFor(0)[1]({
        data: Serializer.toJSON(new Message_(MessageType_.PING, { 'id': id })),
        origin: expectedOrigin,
        source: mockDestWindow,
        type: 'message'
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
        type: 'message'
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
        data: {
          'id': 123,
          'type': 'NOT_PING',
        },
        origin: expectedOrigin,
        source: mockDestWindow,
        type: 'message'
      });
    });
  });
});
