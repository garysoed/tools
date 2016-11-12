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

  describe('getIndexes_', () => {
    it('should initialize the indexes first', () => {
      let indexes = Mocks.object('indexes');
      mockStorage.getItem.and.returnValues(null, JSON.stringify(indexes));

      spyOn(storage, 'updateIndexes_');

      assert(storage['getIndexes_']()).to.equal(indexes);
      assert(storage['updateIndexes_']).to.haveBeenCalledWith([]);
      assert(mockStorage.getItem).to.haveBeenCalledWith(PREFIX);
    });

    it('should not reinitialize the indexes if exists', () => {
      let indexes = Mocks.object('indexes');
      mockStorage.getItem.and.returnValue(JSON.stringify(indexes));

      spyOn(storage, 'updateIndexes_');

      assert(storage['getIndexes_']()).to.equal(indexes);
      assert(storage['updateIndexes_']).toNot.haveBeenCalled();
    });
  });

  describe('getPath_', () => {
    it('should return the correct path', () => {
      let key = 'key';
      assert(storage['getPath_'](key)).to.equal(`${PREFIX}/${key}`);
    });
  });

  describe('updateIndexes_', () => {
    it('should update the storage correctly', () => {
      let indexes = Mocks.object('indexes');
      storage['updateIndexes_'](indexes);
      assert(mockStorage.setItem).to.haveBeenCalledWith(PREFIX, JSON.stringify(indexes));
    });
  });

  describe('create', () => {
    it('should call the update method correctly', (done: any) => {
      let id = 'id';
      let object = Mocks.object('object');

      spyOn(storage, 'getIndexes_').and.returnValue([]);
      spyOn(storage, 'updateIndexes_');
      spyOn(storage, 'update').and.returnValue(Promise.resolve());

      storage
          .create(id, object)
          .then(() => {
            assert(storage.update).to.haveBeenCalledWith(id, object);
            assert(storage['updateIndexes_']).to.haveBeenCalledWith([id]);
            done();
          }, done.fail);
    });

    it('should reject if the ID already exist', (done: any) => {
      let id = 'id';
      let object = Mocks.object('object');

      spyOn(storage, 'getIndexes_').and.returnValue([id]);
      spyOn(storage, 'updateIndexes_');
      spyOn(storage, 'update');

      storage
          .create(id, object)
          .then(
              done.fail,
              (error: Error) => {
                assert(error.message).to.match(/already exist/);
                assert(storage.update).toNot.haveBeenCalled();
                assert(storage['updateIndexes_']).toNot.haveBeenCalled();
                done();
              });
    });
  });

  describe('delete', () => {
    it('should remove the correct object', (done: any) => {
      let id = 'id';
      let path = 'path';
      spyOn(storage, 'getPath_').and.returnValue(path);
      spyOn(storage, 'getIndexes_').and.returnValue([id]);
      spyOn(storage, 'updateIndexes_');
      storage
          .delete(id)
          .then(() => {
            assert(mockStorage.removeItem).to.haveBeenCalledWith(path);
            assert(storage['getPath_']).to.haveBeenCalledWith(id);
            assert(storage['updateIndexes_']).to.haveBeenCalledWith([]);
            done();
          }, done.fail);
    });

    it('should reject if the ID does not exist', (done: any) => {
      let id = 'id';
      let path = 'path';
      spyOn(storage, 'getPath_').and.returnValue(path);
      spyOn(storage, 'getIndexes_').and.returnValue([]);
      spyOn(storage, 'updateIndexes_');
      storage
          .delete(id)
          .then(
              done.fail,
              (error: Error) => {
                assert(error.message).to.match(/does not exist/);
                assert(mockStorage.removeItem).toNot.haveBeenCalled();
                assert(storage['updateIndexes_']).toNot.haveBeenCalled();
                done();
              });
    });
  });

  describe('has', () => {
    it('should resolve with true if the object is in the storage', (done: any) => {
      let id = 'id';
      spyOn(storage, 'getIndexes_').and.returnValue([id]);

      storage
          .has(id)
          .then((result: boolean) => {
            assert(result).to.beTrue();
            done();
          }, done.fail);
    });

    it('should resolve with false if the object is in the storage', (done: any) => {
      let id = 'id';

      spyOn(storage, 'getIndexes_').and.returnValue([]);

      storage
          .has(id)
          .then((result: boolean) => {
            assert(result).to.beFalse();
            done();
          }, done.fail);
    });
  });

  describe('list', () => {
    it('should return the correct indexes', (done: any) => {
      let indexes = Mocks.object('indexes');
      spyOn(storage, 'getIndexes_').and.returnValue(indexes);
      storage
          .list()
          .then((values: any) => {
            assert(values).to.equal(indexes);
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

      storage
          .update(id, object)
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

      storage
          .update('id', Mocks.object('object'))
          .then(
              done.fail,
              (error: Error) => {
                assert(error.message).to.equal(errorMsg);
                done();
              });
    });
  });
});
