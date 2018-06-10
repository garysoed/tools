import { TestBase } from '../test-base';
TestBase.setup();

import { assert } from 'gs-testing/export/main';
import { DataAccess } from '../datamodel/data-access';
import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableMap } from '../immutable/immutable-map';

describe('datamodel.DataAccess', () => {
  let mockGetter: any;
  let mockLister: any;
  let mockSearcher: any;
  let access: DataAccess<number>;

  beforeEach(() => {
    mockGetter = jasmine.createSpy('Getter');
    mockLister = jasmine.createSpy('Lister');
    mockSearcher = jasmine.createSpy('Searcher');
    access = new DataAccess<number>(
        mockGetter,
        mockLister,
        mockSearcher,
        ImmutableMap.of<string, number>([]));
  });

  describe('get', () => {
    it(`should call the getter correctly`, async () => {
      const id = 'id';
      const value = 123;
      mockGetter.and.returnValue(Promise.resolve(value));
      assert(await access.get(id)).to.equal(value);
      assert(mockGetter).to.haveBeenCalledWith(id);
    });
  });

  describe('list', () => {
    it(`should call the lister correctly`, async () => {
      const value = 123;
      mockLister.and.returnValue(Promise.resolve(ImmutableList.of([value])));
      assert(await access.list()).to.haveElements([value]);
    });
  });

  describe('queueUpdate', () => {
    it(`should return a data access with the updated update queue`, () => {
      const id = 'id';
      const value = 123;
      const newAccess = access.queueUpdate(id, value);
      assert(newAccess.getUpdateQueue()).to.haveElements([[id, value]]);
    });
  });

  describe('search', () => {
    it(`should call the searcher correctly`, async () => {
      const id = 'id';
      const value = 123;
      mockSearcher.and.returnValue(Promise.resolve(ImmutableList.of([value])));
      assert(await access.search(id)).to.haveElements([value]);
      assert(mockSearcher).to.haveBeenCalledWith(id);
    });
  });
});
