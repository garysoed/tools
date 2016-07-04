import TestBase from '../test-base';
TestBase.setup();

import {GraphNodeBuilder} from './graph-node-builder';
import {Maps} from '../collection/maps';
import {Mocks} from '../mock/mocks';
import {PipeUtil, __NODE_BUILDER_DATA_MAP, __NODE_DATA_MAP} from './pipe-util';


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

      expect(nodeBuilder.argMetaData[parameterIndex]).toEqual(argMetaData);
      expect(PipeUtil.initializeNodeBuilder).toHaveBeenCalledWith(target, propertyKey);
    });
  });

  describe('createSetter', () => {
    it('should create the setter correctly', () => {
      let mockSetter = jasmine.createSpy('Setter');
      let descriptor = Mocks.object('descriptor');
      descriptor.set = mockSetter;

      let mockGraphNode = jasmine.createSpyObj('GraphNode', ['clearCache']);
      let value = 'value';
      let context = Mocks.object('context');

      let newSetter = PipeUtil.createSetter(descriptor, mockGraphNode);
      newSetter.call(context, value);

      expect(mockGraphNode.clearCache).toHaveBeenCalledWith(context, []);
      expect(mockSetter).toHaveBeenCalledWith(value);
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

      expect(PipeUtil.getNode<any>(context, key)).toEqual(graphNode);
    });

    it('should return null if there are no maps', () => {
      expect(PipeUtil.getNode<any>(Mocks.object('context'), 'key')).toEqual(null);
    });

    it('should return null if the map does not have the key', () => {
      let map = new Map<any, any>();
      let context = Mocks.object('context');
      context[__NODE_DATA_MAP] = map;

      expect(PipeUtil.getNode<any>(context, 'key')).toEqual(null);
    });
  });

  describe('initializeNodeBuilder', () => {
    it('should create a data map and populate it correctly', () => {
      let context = Mocks.object('context');
      let key = 'key';

      let builder = PipeUtil.initializeNodeBuilder(context, key);
      expect(builder).toEqual(jasmine.any(GraphNodeBuilder));
      expect(Maps.of(context[__NODE_BUILDER_DATA_MAP]).asRecord()).toEqual({
        [key]: builder,
      });
    });

    it('should reuse existing data map if exist', () => {
      let map = new Map<any, any>();
      let context = Mocks.object('context');
      context[__NODE_BUILDER_DATA_MAP] = map;

      let key = 'key';

      let builder = PipeUtil.initializeNodeBuilder(context, key);
      expect(builder).toEqual(jasmine.any(GraphNodeBuilder));
      expect(Maps.of(context[__NODE_BUILDER_DATA_MAP]).asRecord()).toEqual({
        [key]: builder,
      });
      expect(context[__NODE_BUILDER_DATA_MAP]).toBe(map);
    });

    it('should return the existing node builder', () => {
      let key = 'key';
      let builder = Mocks.object('builder');
      let map = new Map<any, any>();
      map.set(key, builder);

      let context = Mocks.object('context');
      context[__NODE_BUILDER_DATA_MAP] = map;

      expect(PipeUtil.initializeNodeBuilder(context, key)).toEqual(builder);
    });
  });
});
