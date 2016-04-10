import TestBase from '../test-base';
TestBase.setup();

import Http from './http';

describe('net.Http', () => {
  beforeEach(() => {
    jasmine.Ajax.install();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
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

      let request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({
        'status': 200,
        'contentType': 'text/plain',
        'responseText': expectedResponseText,
      });
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

      jasmine.Ajax.requests.mostRecent().respondWith({
        'status': status,
        'contentType': 'text/plain',
        'responseText': error,
      });
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

      let request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toEqual(path);
      expect(request.method).toEqual('POST');
      expect(request.params).toEqual('a=1&b=2');
      expect(request.requestHeaders).toEqual(jasmine.objectContaining({
        'Content-Type': 'application/x-www-form-urlencoded'
      }));

      request.respondWith({
        'status': 200,
        'contentType': 'text/plain',
        'responseText': expectedResponseText,
      });
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

      jasmine.Ajax.requests.mostRecent().respondWith({
        'status': status,
        'contentType': 'text/plain',
        'responseText': error,
      });
    });
  });
});
