import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Maps } from '../collection/maps';
import { Mocks } from '../mock/mocks';

import { GraphNodeBuilder } from './graph-node-builder';
import { __NODE_BUILDER_DATA_MAP, __NODE_DATA_MAP, PipeUtil } from './pipe-util';


describe('pipeline.PipeUtil', () => {
  describe('addArgument', () => {
    it('should add the metadata correctly', () => {
      const target = Mocks.object('target');
      const propertyKey = 'propertyKey';
      const parameterIndex = 2;
      const argMetaData = Mocks.object('argMetaData');

      const nodeBuilder = Mocks.object('nodeBuilder');
      nodeBuilder.argMetaData = [];

      spyOn(PipeUtil, 'initializeNodeBuilder').and.returnValue(nodeBuilder);

      PipeUtil.addArgument(target, propertyKey, parameterIndex, argMetaData);

      assert(nodeBuilder.argMetaData[parameterIndex]).to.equal(argMetaData);
      assert(PipeUtil.initializeNodeBuilder).to.haveBeenCalledWith(target, propertyKey);
    });
  });

  describe('createSetter', () => {
    it('should create the setter correctly', () => {
      const mockSetter = jasmine.createSpy('Setter');

      const mockGraphNode = jasmine.createSpyObj('GraphNode', ['clearCache']);
      const value = 'value';
      const context = Mocks.object('context');

      const newSetter = PipeUtil.createSetter(mockSetter, mockGraphNode);
      newSetter.call(context, value);

      assert(mockGraphNode.clearCache).to.haveBeenCalledWith(context, []);
      assert(mockSetter).to.haveBeenCalledWith(value);
    });
  });

  describe('getNode', () => {
    it('should return the correct node', () => {
      const map = new Map<any, any>();
      const context = Mocks.object('context');
      context[__NODE_DATA_MAP] = map;

      const key = 'key';
      const graphNode = Mocks.object('graphNode');
      map.set(key, graphNode);

      assert(PipeUtil.getNode<any>(context, key)).to.equal(graphNode);
    });

    it('should return null if there are no maps', () => {
      assert(PipeUtil.getNode<any>(Mocks.object('context'), 'key')).to.equal(null);
    });

    it('should return null if the map does not have the key', () => {
      const map = new Map<any, any>();
      const context = Mocks.object('context');
      context[__NODE_DATA_MAP] = map;

      assert(PipeUtil.getNode<any>(context, 'key')).to.equal(null);
    });
  });

  describe('initializeNodeBuilder', () => {
    it('should create a data map and populate it correctly', () => {
      const context = Mocks.object('context');
      const key = 'key';

      const builder = PipeUtil.initializeNodeBuilder(context, key);
      assert(builder).to.equal(Matchers.any(GraphNodeBuilder));
      assert(Maps.of(context[__NODE_BUILDER_DATA_MAP]).asRecord()).to.equal({
        [key]: builder,
      });
    });

    it('should reuse existing data map if exist', () => {
      const map = new Map<any, any>();
      const context = Mocks.object('context');
      context[__NODE_BUILDER_DATA_MAP] = map;

      const key = 'key';

      const builder = PipeUtil.initializeNodeBuilder(context, key);
      assert(builder).to.equal(Matchers.any(GraphNodeBuilder));
      assert(Maps.of(context[__NODE_BUILDER_DATA_MAP]).asRecord()).to.equal({
        [key]: builder,
      });
      assert(context[__NODE_BUILDER_DATA_MAP]).to.be(map);
    });

    it('should return the existing node builder', () => {
      const key = 'key';
      const builder = Mocks.object('builder');
      const map = new Map<any, any>();
      map.set(key, builder);

      const context = Mocks.object('context');
      context[__NODE_BUILDER_DATA_MAP] = map;

      assert(PipeUtil.initializeNodeBuilder(context, key)).to.equal(builder);
    });
  });
});
