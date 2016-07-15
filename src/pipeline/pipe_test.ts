import {TestBase} from '../test-base';
TestBase.setup();

import {Maps} from '../collection/maps';
import {Mocks} from '../mock/mocks';
import {Pipe} from './pipe';
import {PipeUtil, __NODE_DATA_MAP} from './pipe-util';


describe('pipeline.Pipe', () => {
  it('should add the node for method correctly', () => {
    let map = new Map<any, any>();
    let target = Mocks.object('target');
    target[__NODE_DATA_MAP] = map;

    let propertyKey = 'propertyKey';
    let fn = () => {};
    let descriptor = Mocks.object('descriptor');
    descriptor.value = fn;

    let graphNode = Mocks.object('graphNode');
    let mockNodeBuilder = jasmine.createSpyObj('NodeBuilder', ['build']);
    mockNodeBuilder.build.and.returnValue(graphNode);
    spyOn(PipeUtil, 'initializeNodeBuilder').and.returnValue(mockNodeBuilder);

    expect(Pipe()(target, propertyKey, descriptor)).toEqual(descriptor);
    expect(Maps.of(map).asRecord()).toEqual({[propertyKey]: graphNode});
    expect(PipeUtil.initializeNodeBuilder).toHaveBeenCalledWith(target, propertyKey);
    expect(mockNodeBuilder.fn).toEqual(fn);
  });

  it('should add the node for getter-setters correctly', () => {
    let map = new Map<any, any>();
    let target = Mocks.object('target');
    target[__NODE_DATA_MAP] = map;

    let propertyKey = 'propertyKey';
    let getter = () => {};
    let setter = () => {};
    let descriptor = Mocks.object('descriptor');
    descriptor.get = getter;
    descriptor.set = setter;

    let graphNode = Mocks.object('graphNode');
    let mockNodeBuilder = jasmine.createSpyObj('NodeBuilder', ['build']);
    mockNodeBuilder.build.and.returnValue(graphNode);
    spyOn(PipeUtil, 'initializeNodeBuilder').and.returnValue(mockNodeBuilder);

    let newSetter = Mocks.object('newSetter');
    spyOn(PipeUtil, 'createSetter').and.returnValue(newSetter);

    expect(Pipe()(target, propertyKey, descriptor)).toEqual(descriptor);
    expect(descriptor.set).toEqual(newSetter);
    expect(PipeUtil.createSetter).toHaveBeenCalledWith(setter, graphNode);
    expect(Maps.of(map).asRecord()).toEqual({[propertyKey]: graphNode});
    expect(PipeUtil.initializeNodeBuilder).toHaveBeenCalledWith(target, propertyKey);
    expect(mockNodeBuilder.fn).toEqual(getter);
  });

  it('should work if there are no node data map in the target', () => {
    let target = Mocks.object('target');

    let propertyKey = 'propertyKey';
    let descriptor = Mocks.object('descriptor');
    descriptor.value = () => {};

    let mockNodeBuilder = jasmine.createSpyObj('NodeBuilder', ['build']);
    mockNodeBuilder.build.and.returnValue(Mocks.object('graphNode'));
    spyOn(PipeUtil, 'initializeNodeBuilder').and.returnValue(mockNodeBuilder);

    Pipe()(target, propertyKey, descriptor);
    expect(Maps.of(target[__NODE_DATA_MAP]).keys().asArray()).toEqual([propertyKey]);
  });

  it('should throw error if the same property key is already registered', () => {
    let propertyKey = 'propertyKey';
    let map = new Map<any, any>();
    map.set(propertyKey, Mocks.object('graphNode'));

    let target = Mocks.object('target');
    target[__NODE_DATA_MAP] = map;

    let descriptor = Mocks.object('descriptor');
    descriptor.value = () => {};

    expect(() => {
      Pipe()(target, propertyKey, descriptor);
    }).toThrowError(/is already registered/);
  });

  it('should throw error if the property is not a method or a getter', () => {
    let descriptor = Mocks.object('descriptor');

    expect(() => {
      Pipe()(Mocks.object('target'), 'propertyKey', descriptor);
    }).toThrowError(/method or a getter/);
  });
});
