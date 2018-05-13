import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { DataGraph, registerDataGraph } from '../datamodel';
import { Flags } from '../dispose/base-disposable';
import { Graph, StaticId } from '../graph';

describe('datamodel.registerDataGraph', () => {
  let mockSearcher: any;
  let mockStorage: any;
  let dataGraphId: StaticId<DataGraph<any>>;

  beforeEach(() => {
    Flags.enableTracking = false;

    mockSearcher = jasmine.createSpyObj('Searcher', ['index', 'search']);
    mockStorage = jasmine.createSpyObj(
        'Storage', ['delete', 'generateId', 'list', 'read', 'update']);
    dataGraphId = registerDataGraph('test', mockSearcher, mockStorage);
  });

  describe('delete', () => {
    it(`should delete correctly`, async () => {
      const id = 'id';
      mockStorage.delete.and.returnValue(Promise.resolve());

      const graph = await Graph.get(dataGraphId, Graph.getTimestamp());
      await graph.delete(id);
      assert(mockStorage.delete).to.haveBeenCalledWith(id);
    });
  });

  describe('generateId', () => {
    it(`should return the generated ID`, async () => {
      const id = 'id';
      mockStorage.generateId.and.returnValue(id);

      const graph = await Graph.get(dataGraphId, Graph.getTimestamp());
      assert(await graph.generateId()).to.equal(id);
    });
  });

  describe('get', () => {
    it(`should return the correct object`, async () => {
      const id = 'id';
      const object = Mocks.object('object');
      mockStorage.read.and.returnValue(object);

      const graph = await Graph.get(dataGraphId, Graph.getTimestamp());
      assert(await graph.get(id)).to.equal(object);
      assert(mockStorage.read).to.haveBeenCalledWith(id);
    });
  });

  describe('list', () => {
    it(`should return the correct list`, async () => {
      const list = Mocks.object('list');
      mockStorage.list.and.returnValue(list);

      const graph = await Graph.get(dataGraphId, Graph.getTimestamp());
      assert(await graph.list()).to.equal(list);
    });
  });

  describe('search', () => {
    it(`should return the correct results`, async () => {
      const token = 'token';
      const list = Mocks.object('list');
      mockSearcher.search.and.returnValue(list);

      const graph = await Graph.get(dataGraphId, Graph.getTimestamp());
      assert(await graph.search(token)).to.equal(list);
      assert(mockSearcher.search).to.haveBeenCalledWith(token);
    });
  });

  describe('set', () => {
    it(`should refresh the graph`, async () => {
      const id = 'id';
      const data = Mocks.object('data');

      const list = Mocks.object('list');
      const mockProvider = jasmine.createSpy('Provider');
      const graph = await Graph.get(dataGraphId, Graph.getTimestamp());
      graph['provider_'] = mockProvider;
      spyOn(graph, 'list').and.returnValue(list);

      await graph.set(id, data);
      assert(graph['provider_']).to.haveBeenCalledWith(graph);
      assert(mockSearcher.index).to.haveBeenCalledWith(list);
      assert(mockStorage.update).to.haveBeenCalledWith(id, data);
      assert(mockStorage.read).to.haveBeenCalledWith(id);
    });

    it(`should do nothing if the existing item is the same as the data`, async () => {
      const id = 'id';
      const data = Mocks.object('data');

      mockStorage.read.and.returnValue(data);
      spyOn(Graph, 'refresh');

      const graph = await Graph.get(dataGraphId, Graph.getTimestamp());
      await graph.set(id, data);
      assert(Graph.refresh).toNot.haveBeenCalled();
      assert(mockStorage.read).to.haveBeenCalledWith(id);
    });
  });
});
