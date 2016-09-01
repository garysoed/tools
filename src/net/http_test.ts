import {TestBase} from '../test-base';
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
            expect(responseText).toEqual(expectedResponseText);
            done();
          }, done.fail);

      expect(mockRequest.open).toHaveBeenCalledWith('GET', path);

      expect(mockRequest.send).toHaveBeenCalledWith(null);
      expect(TestListenableDom.getListenable(mockRequest).on).toHaveBeenCalledWith(
          DomEvent.LOAD,
          jasmine.any(Function));

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
                expect(request.status).toEqual(status);
                expect(request.responseText).toEqual(error);
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
            expect(responseText).toEqual(expectedResponseText);
            done();
          }, done.fail);

      expect(mockRequest.open).toHaveBeenCalledWith('POST', path);
      expect(mockRequest.send).toHaveBeenCalledWith('a=1&b=2');
      expect(mockRequest.setRequestHeader)
          .toHaveBeenCalledWith('Content-Type', 'application/x-www-form-urlencoded');
      expect(TestListenableDom.getListenable(mockRequest).on).toHaveBeenCalledWith(
          DomEvent.LOAD,
          jasmine.any(Function));

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
                expect(request.status).toEqual(status);
                expect(request.responseText).toEqual(error);
                done();
              });

      mockRequest.responseText = error;
      mockRequest.status = status;
      TestListenableDom.getListenable(mockRequest).on.calls.argsFor(0)[1]();
    });
  });
});
