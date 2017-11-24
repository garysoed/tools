import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { SimpleSearcher } from '../datamodel';


describe('datamodel.SimpleSearcher', () => {
  let searcher: SimpleSearcher<any>;

  beforeEach(() => {
    searcher = new SimpleSearcher();
  });

  describe('index', () => {
    it(`should add the items correctly`, async () => {
      const index1 = 'index1';
      const mockItem11 = jasmine.createSpyObj('Item11', ['getSearchIndex']);
      mockItem11.getSearchIndex.and.returnValue(index1);
      const mockItem12 = jasmine.createSpyObj('Item12', ['getSearchIndex']);
      mockItem12.getSearchIndex.and.returnValue(index1);

      const index2 = 'index2';
      const mockItem2 = jasmine.createSpyObj('Item2', ['getSearchIndex']);
      mockItem2.getSearchIndex.and.returnValue(index2);

      const data = [mockItem11, mockItem12, mockItem2];

      await searcher.index(Promise.resolve(data));
      assert(searcher['index_']).to.haveEntries([
        [index1, [mockItem11, mockItem12]],
        [index2, [mockItem2]],
      ]);
    });
  });

  describe('search', () => {
    it(`should return the value correctly`, async () => {
      const token = 'token';
      const item1 = Mocks.object('item1');
      const item2 = Mocks.object('item2');
      searcher['index_'].set(token, [item1, item2]);

      assert(await searcher.search(token)).to.haveElements([item1, item2]);
    });

    it(`should return empty if the token does not exist`, async () => {
      assert(await searcher.search('token')).to.haveElements([]);
    });
  });
});
