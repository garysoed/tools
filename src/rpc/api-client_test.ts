import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';
import { ApiClient } from '../rpc/api-client';


describe('rpc.ApiClient', () => {
  let mockChannel;
  let mockResponseCheck;
  let mockResponseType;
  let client: ApiClient<any, any>;

  beforeEach(() => {
    mockChannel = jasmine.createSpyObj('Channel', ['post', 'waitForMessage']);
    mockResponseCheck = jasmine.createSpy('ResponseCheck');
    mockResponseType = jasmine.createSpyObj('ResponseType', ['check']);
    client = new ApiClient(mockChannel, mockResponseCheck, mockResponseType);
  });

  describe('onMessage_', () => {
    it('should return true if the message the correct type and response', () => {
      const request = Mocks.object('request');
      const message = Mocks.object('message');

      mockResponseType.check.and.returnValue(true);
      mockResponseCheck.and.returnValue(true);

      assert(client['onMessage_'](request, message)).to.beTrue();
      assert(mockResponseType.check).to.haveBeenCalledWith(message);
      assert(mockResponseCheck).to.haveBeenCalledWith(request, message);
    });

    it('should return false if the message is the correct type but wrong response', () => {
      const request = Mocks.object('request');
      const message = Mocks.object('message');

      mockResponseType.check.and.returnValue(true);
      mockResponseCheck.and.returnValue(false);

      assert(client['onMessage_'](request, message)).to.beFalse();
      assert(mockResponseType.check).to.haveBeenCalledWith(message);
      assert(mockResponseCheck).to.haveBeenCalledWith(request, message);
    });

    it('should return false if the message is the wrong type', () => {
      const request = Mocks.object('request');
      const message = Mocks.object('message');

      mockResponseType.check.and.returnValue(false);
      mockResponseCheck.and.returnValue(true);

      assert(client['onMessage_'](request, message)).to.beFalse();
      assert(mockResponseType.check).to.haveBeenCalledWith(message);
    });
  });

  describe('post', () => {
    it('should post the request, wait for message and return the correct response',
        async (done: any) => {
          const request = Mocks.object('request');
          spyOn(client, 'onMessage_');

          const response = Mocks.object('response');
          mockChannel.waitForMessage.and.returnValue(Promise.resolve(response));
          mockResponseType.check.and.returnValue(true);

          assert(await client.post(request)).to.equal(response);
          assert(mockResponseType.check).to.haveBeenCalledWith(response);

          assert(mockChannel.waitForMessage).to.haveBeenCalledWith(Matchers.any(Function));

          const message = Mocks.object('message');
          mockChannel.waitForMessage.calls.argsFor(0)[0](message);
          assert(client['onMessage_']).to.haveBeenCalledWith(request, message);
          assert(mockChannel.post).to.haveBeenCalledWith(request);
        });

    it('should reject if the response type is incorrect', async (done: any) => {
      const request = Mocks.object('request');
      spyOn(client, 'onMessage_');

      const response = Mocks.object('response');
      mockChannel.waitForMessage.and.returnValue(Promise.resolve(response));
      mockResponseType.check.and.returnValue(false);

      try {
        await client.post(request);
        done.fail();
      } catch (e) {
        assert(e).to.equal(Matchers.stringMatching(/inconsistent type/));
      }
      assert(mockResponseType.check).to.haveBeenCalledWith(response);
    });
  });
});