import TestBase from '../test-base';
TestBase.setup();

import Asyncs from '../async/asyncs';
import { EventType as ElementEventType } from '../event/listenable-element';
import Mocks from '../mock/mocks';
import PostMessageChannel from './post-message-channel';
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

  describe('post', () => {
    it('should post the message asynchronously', () => {
      let origin = 'origin';
      let message = Mocks.object('message');

      mockDestWindow.postMessage = jasmine.createSpy('postMessage');

      spyOn(PostMessageChannel, 'getOrigin').and.returnValue(origin);

      channel.post(message);

      expect(Asyncs.run).toHaveBeenCalledWith(jasmine.any(Function));
      expect(mockDestWindow.postMessage).toHaveBeenCalledWith(message, origin);
      expect(PostMessageChannel.getOrigin).toHaveBeenCalledWith(mockSrcWindow);
    });
  });

  describe('waitForMessage', () => {
    it('should keep waiting for the test function to return true before resolving',
        (done: any) => {
          let origin = 'origin';
          let testFn = jasmine.createSpy('testFn').and.callFake((data: gs.IJson) => {
            return data['value'];
          });
          let payload1 = { 'value': false };
          let payload2 = { 'value': true };

          spyOn(PostMessageChannel, 'getOrigin').and.returnValue(origin);

          channel
              .waitForMessage(testFn)
              .then((payload: gs.IJson) => {
                expect(payload).toEqual(payload2);
                expect(testFn).toHaveBeenCalledWith(payload1);
                expect(testFn).toHaveBeenCalledWith(payload2);

                expect(PostMessageChannel.getOrigin).toHaveBeenCalledWith(mockDestWindow);
                done();
              }, done.fail);

          channel['srcWindow_'].dispatch(
              ElementEventType.MESSAGE,
              { origin: origin, data: payload1 });
          channel['srcWindow_'].dispatch(
              ElementEventType.MESSAGE,
              { origin: origin, data: payload2 });
        });

    it('should ignore messages with non matching origin',
        (done: any) => {
          let origin = 'origin';
          let testFn = jasmine.createSpy('testFn').and.callFake((data: gs.IJson) => {
            return data['value'];
          });
          let payload1 = { 'value': false };
          let payload2 = { 'value': true };

          spyOn(PostMessageChannel, 'getOrigin').and.returnValue(origin);

          channel
              .waitForMessage(testFn)
              .then(() => {
                expect(testFn).not.toHaveBeenCalledWith(payload1);
                done();
              }, done.fail);

          channel['srcWindow_'].dispatch(
              ElementEventType.MESSAGE,
              { origin: 'otherOrigin', data: payload1 });
          channel['srcWindow_'].dispatch(
              ElementEventType.MESSAGE,
              { origin: origin, data: payload2 });
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
      let mockChannel = jasmine.createSpyObj('Channel', ['post', 'waitForMessage']);
      mockChannel.waitForMessage.and.returnValue(Promise.resolve());

      spyOn(PostMessageChannel, 'newInstance_').and.returnValue(mockChannel);

      spyOn(Math, 'random').and.returnValue(id);

      PostMessageChannel
          .open(mockSrcWindow, mockDestWindow)
          .then((channel: PostMessageChannel) => {
            expect(channel).toEqual(mockChannel);
            expect(PostMessageChannel['newInstance_'])
                .toHaveBeenCalledWith(mockSrcWindow, mockDestWindow);

            expect(mockChannel.waitForMessage.calls.argsFor(0)[0]({ 'id': id, 'type': 'ACK' }))
                .toEqual(true);

            expect(channel.post).toHaveBeenCalledWith({ 'id': id, 'type': 'PING' });
            done();
          }, done.fail);
    });

    it('should ignore message if the ID does not match', (done: any) => {
      let id = 123;
      let mockChannel = jasmine.createSpyObj('Channel', ['post', 'waitForMessage']);
      mockChannel.waitForMessage.and.returnValue(Promise.resolve());

      spyOn(PostMessageChannel, 'newInstance_').and.returnValue(mockChannel);

      spyOn(Math, 'random').and.returnValue(id);

      PostMessageChannel
          .open(mockSrcWindow, mockDestWindow)
          .then((channel: PostMessageChannel) => {
            expect(mockChannel.waitForMessage.calls.argsFor(0)[0]({ 'id': 456, 'type': 'ACK' }))
                .toEqual(false);
            done();
          }, done.fail);
    });

    it('should ignore message if the message type is not ACK', (done: any) => {
      let id = 123;
      let mockChannel = jasmine.createSpyObj('Channel', ['post', 'waitForMessage']);
      mockChannel.waitForMessage.and.returnValue(Promise.resolve());

      spyOn(PostMessageChannel, 'newInstance_').and.returnValue(mockChannel);

      spyOn(Math, 'random').and.returnValue(id);

      PostMessageChannel
          .open(mockSrcWindow, mockDestWindow)
          .then((channel: PostMessageChannel) => {
            expect(mockChannel.waitForMessage.calls.argsFor(0)[0]({ 'id': id, 'type': 'NOT_ACK' }))
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
      let mockChannel = jasmine.createSpyObj('Channel', ['post']);

      spyOn(mockSrcWindow, 'addEventListener');
      spyOn(PostMessageChannel, 'newInstance_').and.returnValue(mockChannel);
      spyOn(window, 'clearTimeout');
      spyOn(window, 'setTimeout').and.returnValue(timeoutId);

      PostMessageChannel
          .listen(mockSrcWindow, expectedOrigin)
          .then((channel: PostMessageChannel) => {
            expect(channel).toEqual(mockChannel);
            expect(channel.post).toHaveBeenCalledWith({ 'id': id, 'type': 'ACK' });

            expect(PostMessageChannel['newInstance_'])
                .toHaveBeenCalledWith(mockSrcWindow, mockDestWindow);

            expect(window.setTimeout)
                .toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Number));
            expect(window.clearTimeout).toHaveBeenCalledWith(timeoutId);
            done();
          }, done.fail);

      expect(mockSrcWindow.addEventListener).toHaveBeenCalledWith('message', jasmine.any(Function));
      mockSrcWindow.addEventListener.calls.argsFor(0)[1]({
        data: {
          'id': id,
          'type': 'PING',
        },
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
