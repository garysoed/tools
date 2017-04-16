import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { DomEvent } from '../event/dom-event';
import { ListenableDom } from '../event/listenable-dom';
import { Mocks } from '../mock/mocks';
import { Http, HttpRequest } from '../net/http';
import { HttpError } from '../net/http-error';


describe('net.Http', () => {
  let mockRequest;

  beforeEach(() => {
    mockRequest = jasmine.createSpyObj('Request', ['open', 'send', 'setRequestHeader']);
    spyOn(HttpRequest, 'newRequest').and.returnValue(mockRequest);
  });

  describe('get', async () => {
    it('should handle successful request correctly', async () => {
      const path = 'path';
      const expectedResponseText = 'responseText';
      const listenableRequest = Mocks.listenable('listenableRequest');
      spyOn(listenableRequest, 'on').and.callThrough();
      spyOn(ListenableDom, 'of').and.returnValue(listenableRequest);

      const promise = Http.get(path).send();
      assert(mockRequest.open).to.haveBeenCalledWith('GET', path);

      assert(mockRequest.send).to.haveBeenCalledWith(null);
      assert(listenableRequest.on).to
          .haveBeenCalledWith(DomEvent.LOAD, Matchers.any(Function), Matchers.any(Object));

      mockRequest.responseText = expectedResponseText;
      mockRequest.status = 200;
      listenableRequest.on.calls.argsFor(0)[1]();

      const responseText = await promise;
      assert(responseText).to.equal(expectedResponseText);
    });

    it('should handle unsuccessful request correctly', async () => {
      const status = 400;
      const error = 'error';
      const listenableRequest = Mocks.listenable('listenableRequest', mockRequest);
      spyOn(listenableRequest, 'on').and.callThrough();

      spyOn(ListenableDom, 'of').and.returnValue(listenableRequest);
      const promise = Http.get('path').send();

      mockRequest.responseText = error;
      mockRequest.status = status;
      listenableRequest.on.calls.argsFor(0)[1]();

      const actualError = await assert(promise).to.rejectWithErrorType(HttpError, /Request failed/);
      const request = actualError.request;
      assert(request.status).to.equal(status);
      assert(request.responseText).to.equal(error);
    });
  });

  describe('post', () => {
    it('should handle successful request correctly', async () => {
      const path = 'path';
      const formData = {
        'a': '1',
        'b': '2',
      };
      const listenableRequest = Mocks.listenable('listenableRequest', mockRequest);
      spyOn(listenableRequest, 'on').and.callThrough();

      spyOn(ListenableDom, 'of').and.returnValue(listenableRequest);

      const expectedResponseText = 'responseText';
      const promise = Http.post(path).setFormData(formData).send();

      assert(mockRequest.open).to.haveBeenCalledWith(`POST`, path);
      assert(mockRequest.send).to.haveBeenCalledWith(`{"a":"1","b":"2"}`);
      assert(mockRequest.setRequestHeader).to
          .haveBeenCalledWith('Content-Type', 'application/json');
      assert(listenableRequest.on).to
          .haveBeenCalledWith(DomEvent.LOAD, Matchers.any(Function), Matchers.any(Object));

      mockRequest.responseText = expectedResponseText;
      mockRequest.status = 200;
      listenableRequest.on.calls.argsFor(0)[1]();

      const responseText = await promise;
      assert(responseText).to.equal(expectedResponseText);
    });

    it('should handle unsuccessful request correctly', async () => {
      const status = 400;
      const error = 'error';
      const listenableRequest = Mocks.listenable('listenableRequest', mockRequest);
      spyOn(listenableRequest, 'on').and.callThrough();

      spyOn(ListenableDom, 'of').and.returnValue(listenableRequest);
      const promise = Http.post('path').send();
      mockRequest.responseText = error;
      mockRequest.status = status;
      listenableRequest.on.calls.argsFor(0)[1]();

      const actualError = await assert(promise).to.rejectWithErrorType(HttpError, /Request failed/);
      const request: XMLHttpRequest = actualError.request;
      assert(request.status).to.equal(status);
      assert(request.responseText).to.equal(error);
    });
  });
});
