import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Maps } from '../collection/maps';
import { Mocks } from '../mock/mocks';

import { GraphNodeBuilder } from './graph-node-builder';
import { __NODE_BUILDER_DATA_MAP, __NODE_DATA_MAP, PipeUtil } from './pipe-util';


describe('pipeline.PipeUtil', () => {
  describe('addArgument', () => {
    it('should add the metadata correctly', () => {
      let target = Mocks.object('target');
      let propertyKey = 'propertyKey';
      let parameterIndex = 2;
      let argMetaData = Mocks.object('argMetaData');

      let nodeBuilder = Mocks.object('nodeBuilder');
      nodeBuilder.argMetaData = [];

      spyOn(PipeUtil, 'initializeNodeBuilder').and.returnValue(nodeBuilder);

      PipeUtil.addArgument(target, propertyKey, parameterIndex, argMetaData);

      assert(nodeBuilder.argMetaData[parameterIndex]).to.equal(argMetaData);
      assert(PipeUtil.initializeNodeBuilder).to.haveBeenCalledWith(target, propertyKey);
    });
  });

  describe('createSetter', () => {
    it('should create the setter correctly', () => {
      let mockSetter = jasmine.createSpy('Setter');

      let mockGraphNode = jasmine.createSpyObj('GraphNode', ['clearCache']);
      let value = 'value';
      let context = Mocks.object('context');

      let newSetter = PipeUtil.createSetter(mockSetter, mockGraphNode);
      newSetter.call(context, value);

      assert(mockGraphNode.clearCache).to.haveBeenCalledWith(context, []);
      assert(mockSetter).to.haveBeenCalledWith(value);
    });
  });

  describe('getNode', () => {
    it('should return the correct node', () => {
      let map = new Map<any, any>();
      let context = Mocks.object('context');
      context[__NODE_DATA_MAP] = map;

      let key = 'key';
      let graphNode = Mocks.object('graphNode');
      map.set(key, graphNode);

      assert(PipeUtil.getNode<any>(context, key)).to.equal(graphNode);
    });

    it('should return null if there are no maps', () => {
      assert(PipeUtil.getNode<any>(Mocks.object('context'), 'key')).to.equal(null);
    });

    it('should return null if the map does not have the key', () => {
      let map = new Map<any, any>();
      let context = Mocks.object('context');
      context[__NODE_DATA_MAP] = map;

      assert(PipeUtil.getNode<any>(context, 'key')).to.equal(null);
    });
  });

  describe('initializeNodeBuilder', () => {
    it('should create a data map and populate it correctly', () => {
      let context = Mocks.object('context');
      let key = 'key';

      let builder = PipeUtil.initializeNodeBuilder(context, key);
      assert(builder).to.equal(Matchers.any(GraphNodeBuilder));
      assert(Maps.of(context[__NODE_BUILDER_DATA_MAP]).asRecord()).to.equal({
        [key]: builder,
      });
    });

    it('should reuse existing data map if exist', () => {
      let map = new Map<any, any>();
      let context = Mocks.object('context');
      context[__NODE_BUILDER_DATA_MAP] = map;

      let key = 'key';

      let builder = PipeUtil.initializeNodeBuilder(context, key);
      assert(builder).to.equal(Matchers.any(GraphNodeBuilder));
      assert(Maps.of(context[__NODE_BUILDER_DATA_MAP]).asRecord()).to.equal({
        [key]: builder,
      });
      assert(context[__NODE_BUILDER_DATA_MAP]).to.be(map);
    });

    it('should return the existing node builder', () => {
      let key = 'key';
      let builder = Mocks.object('builder');
      let map = new Map<any, any>();
      map.set(key, builder);

      let context = Mocks.object('context');
      context[__NODE_BUILDER_DATA_MAP] = map;

      assert(PipeUtil.initializeNodeBuilder(context, key)).to.equal(builder);
    });
  });
});
