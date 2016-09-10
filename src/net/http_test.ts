import {assert, TestBase, verify} from '../test-base';
TestBase.setup();

import {DomEvent} from '../event/dom-event';
import {Http, HttpRequest} from './http';
import {TestListenableDom} from '../testing/test-listenable-dom';


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
      Http.get(path)
          .send()
          .then((responseText: string) => {
            assert(responseText).to.equal(expectedResponseText);
            done();
          }, done.fail);

      verify(mockRequest.open)('GET', path);

      verify(mockRequest.send)(null);
      verify(TestListenableDom.getListenable(mockRequest).on)(DomEvent.LOAD, jasmine.any(Function));

      mockRequest.responseText = expectedResponseText;
      mockRequest.status = 200;
      TestListenableDom.getListenable(mockRequest).on.calls.argsFor(0)[1]();
    });

    it('should handle unsuccessful request correctly', (done: any) => {
      let status = 400;
      let error = 'error';
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
      TestListenableDom.getListenable(mockRequest).on.calls.argsFor(0)[1]();
    });
  });

  describe('post', () => {
    it('should handle successful request correctly', (done: any) => {
      let path = 'path';
      let formData = {
        'a': '1',
        'b': '2',
      };
      let expectedResponseText = 'responseText';
      Http.post(path)
          .setFormData(formData)
          .send()
          .then((responseText: string) => {
            assert(responseText).to.equal(expectedResponseText);
            done();
          }, done.fail);

      verify(mockRequest.open)('POST', path);
      verify(mockRequest.send)('a=1&b=2');
      verify(mockRequest.setRequestHeader)('Content-Type', 'application/x-www-form-urlencoded');
      verify(TestListenableDom.getListenable(mockRequest).on)(DomEvent.LOAD, jasmine.any(Function));

      mockRequest.responseText = expectedResponseText;
      mockRequest.status = 200;
      TestListenableDom.getListenable(mockRequest).on.calls.argsFor(0)[1]();
    });

    it('should handle unsuccessful request correctly', (done: any) => {
      let status = 400;
      let error = 'error';
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
      TestListenableDom.getListenable(mockRequest).on.calls.argsFor(0)[1]();
    });
  });
});
