import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Maps } from '../collection/maps';
import { Mocks } from '../mock/mocks';

import { Pipe } from './pipe';
import { __NODE_DATA_MAP, PipeUtil } from './pipe-util';


describe('pipeline.Pipe', () => {
  it('should add the node for method correctly', () => {
    const map = new Map<any, any>();
    const target = Mocks.object('target');
    target[__NODE_DATA_MAP] = map;

    const propertyKey = 'propertyKey';
    const fn = () => {};
    const descriptor = Mocks.object('descriptor');
    descriptor.value = fn;

    const graphNode = Mocks.object('graphNode');
    const mockNodeBuilder = jasmine.createSpyObj('NodeBuilder', ['build']);
    mockNodeBuilder.build.and.returnValue(graphNode);
    spyOn(PipeUtil, 'initializeNodeBuilder').and.returnValue(mockNodeBuilder);

    assert(Pipe()(target, propertyKey, descriptor)).to.equal(descriptor);
    assert(Maps.of(map).asRecord()).to.equal({[propertyKey]: graphNode});
    assert(PipeUtil.initializeNodeBuilder).to.haveBeenCalledWith(target, propertyKey);
    assert(mockNodeBuilder.fn).to.equal(fn);
  });

  it('should add the node for getter-setters correctly', () => {
    const map = new Map<any, any>();
    const target = Mocks.object('target');
    target[__NODE_DATA_MAP] = map;

    const propertyKey = 'propertyKey';
    const getter = () => {};
    const setter = () => {};
    const descriptor = Mocks.object('descriptor');
    descriptor.get = getter;
    descriptor.set = setter;

    const graphNode = Mocks.object('graphNode');
    const mockNodeBuilder = jasmine.createSpyObj('NodeBuilder', ['build']);
    mockNodeBuilder.build.and.returnValue(graphNode);
    spyOn(PipeUtil, 'initializeNodeBuilder').and.returnValue(mockNodeBuilder);

    const newSetter = Mocks.object('newSetter');
    spyOn(PipeUtil, 'createSetter').and.returnValue(newSetter);

    assert(Pipe()(target, propertyKey, descriptor)).to.equal(descriptor);
    assert(descriptor.set).to.equal(newSetter);
    assert(PipeUtil.createSetter).to.haveBeenCalledWith(setter, graphNode);
    assert(Maps.of(map).asRecord()).to.equal({[propertyKey]: graphNode});
    assert(PipeUtil.initializeNodeBuilder).to.haveBeenCalledWith(target, propertyKey);
    assert(mockNodeBuilder.fn).to.equal(getter);
  });

  it('should work if there are no node data map in the target', () => {
    const target = Mocks.object('target');

    const propertyKey = 'propertyKey';
    const descriptor = Mocks.object('descriptor');
    descriptor.value = () => {};

    const mockNodeBuilder = jasmine.createSpyObj('NodeBuilder', ['build']);
    mockNodeBuilder.build.and.returnValue(Mocks.object('graphNode'));
    spyOn(PipeUtil, 'initializeNodeBuilder').and.returnValue(mockNodeBuilder);

    Pipe()(target, propertyKey, descriptor);
    assert(Maps.of(target[__NODE_DATA_MAP]).keys().asArray()).to.equal([propertyKey]);
  });

  it('should throw error if the same property key is already registered', () => {
    const propertyKey = 'propertyKey';
    const map = new Map<any, any>();
    map.set(propertyKey, Mocks.object('graphNode'));

    const target = Mocks.object('target');
    target[__NODE_DATA_MAP] = map;

    const descriptor = Mocks.object('descriptor');
    descriptor.value = () => {};

    assert(() => {
      Pipe()(target, propertyKey, descriptor);
    }).to.throwError(/is already registered/);
  });

  it('should throw error if the property is not a method or a getter', () => {
    const descriptor = Mocks.object('descriptor');

    assert(() => {
      Pipe()(Mocks.object('target'), 'propertyKey', descriptor);
    }).to.throwError(/method or a getter/);
  });
});
