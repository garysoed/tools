import { assert, Matchers, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { DomEvent } from '../event/dom-event';
import { ListenableDom } from '../event/listenable-dom';
import { Http, HttpRequest } from '../net/http';
import { HttpError } from '../net/http-error';


describe('net.Http', () => {
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = createSpyObject('Request', ['open', 'send', 'setRequestHeader']);
    spyOn(HttpRequest, 'newRequest').and.returnValue(mockRequest);
  });

  describe('get', async () => {
    should('handle successful request correctly', async () => {
      const path = 'path';
      const expectedResponseText = 'responseText';
      const mockListenableRequest = createSpyObject('ListenableRequest', ['dispose']);

      spyOn(ListenableDom, 'of').and.returnValue(mockListenableRequest);

      const getRequest = Http.get(path);
      const listenToSpy = spyOn(getRequest, 'listenTo');

      const promise = getRequest.send();
      assert(mockRequest.open).to.haveBeenCalledWith('GET', path);

      assert(mockRequest.send).to.haveBeenCalledWith(null);
      assert(getRequest.listenTo).to
          .haveBeenCalledWith(mockListenableRequest, DomEvent.LOAD, Matchers.anyFunction());

      mockRequest.responseText = expectedResponseText;
      mockRequest.status = 200;
      listenToSpy.calls.argsFor(0)[2]();

      const responseText = await promise;
      assert(responseText).to.equal(expectedResponseText);
    });

    should('handle unsuccessful request correctly', async () => {
      const status = 400;
      const error = 'error';
      const mockListenableRequest = createSpyObject('ListenableRequest', ['dispose']);

      spyOn(ListenableDom, 'of').and.returnValue(mockListenableRequest);
      const getRequest = Http.get('path');
      const listenToSpy = spyOn(getRequest, 'listenTo');

      const promise = getRequest.send();

      mockRequest.responseText = error;
      mockRequest.status = status;
      listenToSpy.calls.argsFor(0)[2]();

      const actualError = await assert(promise).to.rejectWithErrorType(HttpError, /Request failed/);
      const request = actualError.request;
      assert(request.status).to.equal(status);
      assert(request.responseText).to.equal(error);
    });
  });

  describe('post', () => {
    should('handle successful request correctly', async () => {
      const path = 'path';
      const formData = {
        'a': '1',
        'b': '2',
      };
      const mockListenableRequest = createSpyObject('ListenableRequest', ['dispose']);

      spyOn(ListenableDom, 'of').and.returnValue(mockListenableRequest);

      const expectedResponseText = 'responseText';
      const postRequest = Http.post(path);
      const spyListenTo = spyOn(postRequest, 'listenTo');

      const promise = postRequest.setFormData(formData).send();

      assert(mockRequest.open).to.haveBeenCalledWith(`POST`, path);
      assert(mockRequest.send).to.haveBeenCalledWith(`{"a":"1","b":"2"}`);
      assert(mockRequest.setRequestHeader).to
          .haveBeenCalledWith('Content-Type', 'application/json');
      assert(postRequest.listenTo).to
          .haveBeenCalledWith(mockListenableRequest, DomEvent.LOAD, Matchers.anyFunction());

      mockRequest.responseText = expectedResponseText;
      mockRequest.status = 200;
      spyListenTo.calls.argsFor(0)[2]();

      const responseText = await promise;
      assert(responseText).to.equal(expectedResponseText);
    });

    should('handle unsuccessful request correctly', async () => {
      const status = 400;
      const error = 'error';
      const mockListenableRequest = createSpyObject('ListenableRequest', ['dispose']);

      spyOn(ListenableDom, 'of').and.returnValue(mockListenableRequest);
      const postRequest = Http.post('path');
      const spyListenTo = spyOn(postRequest, 'listenTo');
      const promise = postRequest.send();
      mockRequest.responseText = error;
      mockRequest.status = status;
      spyListenTo.calls.argsFor(0)[2]();

      const actualError = await assert(promise).to.rejectWithErrorType(HttpError, /Request failed/);
      const request: XMLHttpRequest = actualError.request;
      assert(request.status).to.equal(status);
      assert(request.responseText).to.equal(error);
    });
  });
});
