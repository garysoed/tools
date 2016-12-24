import {assert, TestBase} from 'src/test-base';
TestBase.setup();

import {Maps} from 'src/collection/maps';
import {Mocks} from 'src/mock/mocks';

import {inject} from './a-inject';
import {InjectMetadata} from './inject-metadata';
import {InjectUtil} from './inject-util';

class TestClass {}


describe('inject.Inject', () => {
  it('should register the parameter correctly', () => {
    let name = 'name';
    let index = 12;
    let fakeMetadata = new Map<number, string>();
    let injectMetadata = Mocks.object('injectMetadata');
    let defaultValue = Mocks.object('defaultValue');

    spyOn(InjectUtil, 'getMetadataMap').and.returnValue(fakeMetadata);
    spyOn(InjectMetadata, 'newInstance').and.returnValue(injectMetadata);

    inject(name, defaultValue)(TestClass, 'propertyName', index);

    assert(Maps.of(fakeMetadata).asRecord()).to.equal({[index]: injectMetadata});
    assert(InjectMetadata.newInstance).to.haveBeenCalledWith(name, defaultValue);
  });

  it('should use the parameter name if not specified', () => {
    let propertyName = 'propertyName';
    let index = 12;
    let fakeMetadata = new Map<number, string>();
    let injectMetadata = Mocks.object('injectMetadata');

    spyOn(InjectUtil, 'getMetadataMap').and.returnValue(fakeMetadata);
    spyOn(InjectMetadata, 'newInstance').and.returnValue(injectMetadata);

    inject()(TestClass, propertyName, index);

    assert(Maps.of(fakeMetadata).asRecord()).to.equal({[index]: injectMetadata});
    assert(InjectMetadata.newInstance).to.haveBeenCalledWith(propertyName, undefined);
  });

  it('should throw error if the target is not a constructor', () => {
    assert(() => {
      inject()(Mocks.object('target'), 'propertyName', 12);
    }).to.throwError(/is not a constructor/);
  });
});
