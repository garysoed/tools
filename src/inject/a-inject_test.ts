import {assert, TestBase, verify} from '../test-base';
TestBase.setup();

import {inject} from './a-inject';
import {InjectMetadata} from './inject-metadata';
import {InjectUtil} from './inject-util';
import {Maps} from '../collection/maps';
import {Mocks} from '../mock/mocks';

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
    verify(InjectMetadata.newInstance)(name, defaultValue);
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
    verify(InjectMetadata.newInstance)(propertyName, undefined);
  });

  it('should throw error if the target is not a constructor', () => {
    assert(() => {
      inject()(Mocks.object('target'), 'propertyName', 12);
    }).to.throwError(/is not a constructor/);
  });
});
