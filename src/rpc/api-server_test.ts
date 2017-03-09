import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';
import { ApiServer } from '../rpc/api-server';


describe('rpc.ApiServer', () => {
  let mockChannel;
  let mockProcessRequest;
  let mockRequestType;
  let server: ApiServer<any, any>;

  beforeEach(() => {
    mockChannel = jasmine.createSpyObj('Channel', ['post', 'waitForMessage']);
    mockProcessRequest = jasmine.createSpy('ProcessRequest');
    mockRequestType = jasmine.createSpyObj('RequestType', ['check']);
    server = new ApiServer(mockChannel, mockProcessRequest, mockRequestType);
  });

  describe('onMessage_', () => {
    it('should post the response correctly', () => {
      const message = Mocks.object('message');
      mockRequestType.check.and.returnValue(true);

      const response = Mocks.object('response');
      const mockPromise = jasmine.createSpyObj('Promise', ['then']);
      mockProcessRequest.and.returnValue(mockPromise);

      assert(server['onMessage_'](message)).to.beFalse();
      assert(mockProcessRequest).to.haveBeenCalledWith(message);
      assert(mockRequestType.check).to.haveBeenCalledWith(message);

      assert(mockPromise.then).to.haveBeenCalledWith(Matchers.any(Function));
      mockPromise.then.calls.argsFor(0)[0](response);
      assert(mockChannel.post).to.haveBeenCalledWith(response);
    });

    it('should do nothing if the message is the wrong type', () => {
      const message = Mocks.object('message');
      mockRequestType.check.and.returnValue(false);

      assert(server['onMessage_'](message)).to.beFalse();
      assert(mockChannel.post).toNot.haveBeenCalled();
      assert(mockRequestType.check).to.haveBeenCalledWith(message);
    });
  });

  describe('run', () => {
    it('should wait for the message', () => {
      spyOn(server, 'onMessage_');
      server.run();
      assert(mockChannel.waitForMessage).to.haveBeenCalledWith(Matchers.any(Function));

      const message = Mocks.object('message');
      mockChannel.waitForMessage.calls.argsFor(0)[0](message);
      assert(server['onMessage_']).to.haveBeenCalledWith(message);
    });
  });
});
