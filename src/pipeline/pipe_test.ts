import {assert, TestBase} from 'src/test-base';
TestBase.setup();

import {Maps} from 'src/collection/maps';
import {Mocks} from 'src/mock/mocks';

import {Pipe} from './pipe';
import {__NODE_DATA_MAP, PipeUtil} from './pipe-util';


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

    assert(Pipe()(target, propertyKey, descriptor)).to.equal(descriptor);
    assert(Maps.of(map).asRecord()).to.equal({[propertyKey]: graphNode});
    assert(PipeUtil.initializeNodeBuilder).to.haveBeenCalledWith(target, propertyKey);
    assert(mockNodeBuilder.fn).to.equal(fn);
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

    assert(Pipe()(target, propertyKey, descriptor)).to.equal(descriptor);
    assert(descriptor.set).to.equal(newSetter);
    assert(PipeUtil.createSetter).to.haveBeenCalledWith(setter, graphNode);
    assert(Maps.of(map).asRecord()).to.equal({[propertyKey]: graphNode});
    assert(PipeUtil.initializeNodeBuilder).to.haveBeenCalledWith(target, propertyKey);
    assert(mockNodeBuilder.fn).to.equal(getter);
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
    assert(Maps.of(target[__NODE_DATA_MAP]).keys().asArray()).to.equal([propertyKey]);
  });

  it('should throw error if the same property key is already registered', () => {
    let propertyKey = 'propertyKey';
    let map = new Map<any, any>();
    map.set(propertyKey, Mocks.object('graphNode'));

    let target = Mocks.object('target');
    target[__NODE_DATA_MAP] = map;

    let descriptor = Mocks.object('descriptor');
    descriptor.value = () => {};

    assert(() => {
      Pipe()(target, propertyKey, descriptor);
    }).to.throwError(/is already registered/);
  });

  it('should throw error if the property is not a method or a getter', () => {
    let descriptor = Mocks.object('descriptor');

    assert(() => {
      Pipe()(Mocks.object('target'), 'propertyKey', descriptor);
    }).to.throwError(/method or a getter/);
  });
});
