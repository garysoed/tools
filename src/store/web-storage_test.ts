import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';
import {Serializer} from '../data/a-serializable';
import {WebStorage} from './web-storage';


describe('store.WebStorage', () => {
  const PREFIX = 'prefix';
  let mockStorage;
  let storage: WebStorage<any>;

  beforeEach(() => {
    mockStorage = jasmine.createSpyObj('Storage', ['getItem', 'removeItem', 'setItem']);
    storage = new WebStorage<any>(mockStorage, PREFIX);
  });

  describe('getPath_', () => {
    it('should return the correct path', () => {
      let key = 'key';
      assert(storage['getPath_'](key)).to.equal(`${PREFIX}/${key}`);
    });
  });

  describe('create', () => {
    it('should call the update method correctly', (done: any) => {
      let id = 'id';
      let object = Mocks.object('object');

      spyOn(storage, 'update').and.returnValue(Promise.resolve());

      storage.create(id, object)
          .then(() => {
            assert(storage.update).to.haveBeenCalledWith(id, object);
            done();
          }, done.fail);
    });
  });

  describe('delete', () => {
    it('should remove the correct object', (done: any) => {
      let id = 'id';
      let path = 'path';
      spyOn(storage, 'getPath_').and.returnValue(path);
      storage.delete(id)
          .then(() => {
            assert(mockStorage.removeItem).to.haveBeenCalledWith(path);
            assert(storage['getPath_']).to.haveBeenCalledWith(id);
            done();
          }, done.fail);
    });
  });

  describe('has', () => {
    it('should resolve with true if the object is in the storage', (done: any) => {
      let id = 'id';
      let path = 'path';
      let object = Mocks.object('object');

      spyOn(storage, 'getPath_').and.returnValue(path);
      mockStorage.getItem.and.returnValue(object);

      storage.has(id)
          .then((result: boolean) => {
            assert(result).to.beTrue();
            assert(mockStorage.getItem).to.haveBeenCalledWith(path);
            assert(storage['getPath_']).to.haveBeenCalledWith(id);
            done();
          }, done.fail);
    });

    it('should resolve with false if the object is in the storage', (done: any) => {
      let id = 'id';
      let path = 'path';

      spyOn(storage, 'getPath_').and.returnValue(path);
      mockStorage.getItem.and.returnValue(null);

      storage.has(id)
          .then((result: boolean) => {
            assert(result).to.beFalse();
            done();
          }, done.fail);
    });
  });

  describe('read', () => {
    it('should resolve with the object', (done: any) => {
      let id = 'id';
      let path = 'path';
      let stringValue = 'stringValue';
      let object = Mocks.object('object');
      let json = Mocks.object('json');

      mockStorage.getItem.and.returnValue(stringValue);
      spyOn(storage, 'getPath_').and.returnValue(path);
      spyOn(JSON, 'parse').and.returnValue(json);
      spyOn(Serializer, 'fromJSON').and.returnValue(object);

      storage.read(id)
          .then((result: any) => {
            assert(result).to.equal(object);
            assert(Serializer.fromJSON).to.haveBeenCalledWith(json);
            assert(JSON.parse).to.haveBeenCalledWith(stringValue);
            assert(mockStorage.getItem).to.haveBeenCalledWith(path);
            assert(storage['getPath_']).to.haveBeenCalledWith(id);
            done();
          }, done.fail);
    });

    it('should resolve with null if the object does not exist', (done: any) => {
      mockStorage.getItem.and.returnValue(null);
      spyOn(storage, 'getPath_').and.returnValue('path');

      storage.read('id')
          .then((result: any) => {
            assert(result).to.beNull();
            done();
          }, done.fail);
    });

    it('should reject if there was an error', (done: any) => {
      let errorMsg = 'errorMsg';
      mockStorage.getItem.and.throwError(errorMsg);
      spyOn(storage, 'getPath_').and.returnValue('path');

      storage.read('id')
          .then(
              done.fail,
              (error: Error) => {
                assert(error.message).to.equal(errorMsg);
                done();
              });
    });
  });

  describe('update', () => {
    it('should store the correct object in the storage', (done: any) => {
      let id = 'id';
      let path = 'path';
      let object = Mocks.object('object');
      let stringValue = 'stringValue';
      let json = Mocks.object('json');

      spyOn(storage, 'getPath_').and.returnValue(path);
      spyOn(Serializer, 'toJSON').and.returnValue(json);
      spyOn(JSON, 'stringify').and.returnValue(stringValue);

      storage.create(id, object)
          .then(() => {
            assert(mockStorage.setItem).to.haveBeenCalledWith(path, stringValue);
            assert(JSON.stringify).to.haveBeenCalledWith(json);
            assert(Serializer.toJSON).to.haveBeenCalledWith(object);
            done();
          }, done.fail);
    });

    it('should reject if there was an error', (done: any) => {
      let errorMsg = 'errorMsg';

      spyOn(Serializer, 'toJSON').and.throwError(errorMsg);

      storage.create('id', Mocks.object('object'))
          .then(
              done.fail,
              (error: Error) => {
                assert(error.message).to.equal(errorMsg);
                done();
              });
    });
  });
});
