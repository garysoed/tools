import {assert, Matchers, TestBase} from '../test-base';
TestBase.setup();

import {DomEvent} from '../event/dom-event';
import {Http, HttpRequest} from './http';
import {ListenableDom} from '../event/listenable-dom';
import {Mocks} from '../mock/mocks';


describe('net.Http', () => {
  let mockRequest;

  beforeEach(() => {
    mockRequest = jasmine.createSpyObj('Request', ['open', 'send', 'setRequestHeader']);
    spyOn(HttpRequest, 'newRequest').and.returnValue(mockRequest);
  });

  describe('get', () => {
    it('should handle successful request correctly', (done: any) => {
      let path = 'path';
      let expectedResponseText = 'responseText';
      let listenableRequest = Mocks.listenable('listenableRequest');
      spyOn(listenableRequest, 'on').and.callThrough();
      spyOn(ListenableDom, 'of').and.returnValue(listenableRequest);

      Http.get(path)
          .send()
          .then((responseText: string) => {
            assert(responseText).to.equal(expectedResponseText);
            done();
          }, done.fail);

      assert(mockRequest.open).to.haveBeenCalledWith('GET', path);

      assert(mockRequest.send).to.haveBeenCalledWith(null);
      assert(listenableRequest.on).to
          .haveBeenCalledWith(DomEvent.LOAD, Matchers.any(Function), Matchers.any(Object));

      mockRequest.responseText = expectedResponseText;
      mockRequest.status = 200;
      listenableRequest.on.calls.argsFor(0)[1]();
    });

    it('should handle unsuccessful request correctly', (done: any) => {
      let status = 400;
      let error = 'error';
      let listenableRequest = Mocks.listenable('listenableRequest', mockRequest);
      spyOn(listenableRequest, 'on').and.callThrough();

      spyOn(ListenableDom, 'of').and.returnValue(listenableRequest);
      Http.get('path')
          .send()
          .then(
              done.fail,
              (request: XMLHttpRequest) => {
                assert(request.status).to.equal(status);
                assert(request.responseText).to.equal(error);
                done();
              });

      mockRequest.responseText = error;
      mockRequest.status = status;
      listenableRequest.on.calls.argsFor(0)[1]();
    });
  });

  describe('post', () => {
    it('should handle successful request correctly', (done: any) => {
      let path = 'path';
      let formData = {
        'a': '1',
        'b': '2',
      };
      let listenableRequest = Mocks.listenable('listenableRequest', mockRequest);
      spyOn(listenableRequest, 'on').and.callThrough();

      spyOn(ListenableDom, 'of').and.returnValue(listenableRequest);

      let expectedResponseText = 'responseText';
      Http.post(path)
          .setFormData(formData)
          .send()
          .then((responseText: string) => {
            assert(responseText).to.equal(expectedResponseText);
            done();
          }, done.fail);

      assert(mockRequest.open).to.haveBeenCalledWith('POST', path);
      assert(mockRequest.send).to.haveBeenCalledWith('a=1&b=2');
      assert(mockRequest.setRequestHeader).to
          .haveBeenCalledWith('Content-Type', 'application/x-www-form-urlencoded');
      assert(listenableRequest.on).to
          .haveBeenCalledWith(DomEvent.LOAD, Matchers.any(Function), Matchers.any(Object));

      mockRequest.responseText = expectedResponseText;
      mockRequest.status = 200;
      listenableRequest.on.calls.argsFor(0)[1]();
    });

    it('should handle unsuccessful request correctly', (done: any) => {
      let status = 400;
      let error = 'error';
      let listenableRequest = Mocks.listenable('listenableRequest', mockRequest);
      spyOn(listenableRequest, 'on').and.callThrough();

      spyOn(ListenableDom, 'of').and.returnValue(listenableRequest);
      Http.post('path')
          .send()
          .then(
              done.fail,
              (request: XMLHttpRequest) => {
                assert(request.status).to.equal(status);
                assert(request.responseText).to.equal(error);
                done();
              });

      mockRequest.responseText = error;
      mockRequest.status = status;
      listenableRequest.on.calls.argsFor(0)[1]();
    });
  });
});
