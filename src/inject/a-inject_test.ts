import {TestBase} from '../test-base';
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

    expect(Maps.of(fakeMetadata).asRecord()).toEqual({[index]: injectMetadata});
    expect(InjectMetadata.newInstance).toHaveBeenCalledWith(name, defaultValue);
  });

  it('should use the parameter name if not specified', () => {
    let propertyName = 'propertyName';
    let index = 12;
    let fakeMetadata = new Map<number, string>();
    let injectMetadata = Mocks.object('injectMetadata');

    spyOn(InjectUtil, 'getMetadataMap').and.returnValue(fakeMetadata);
    spyOn(InjectMetadata, 'newInstance').and.returnValue(injectMetadata);

    inject()(TestClass, propertyName, index);

    expect(Maps.of(fakeMetadata).asRecord()).toEqual({[index]: injectMetadata});
    expect(InjectMetadata.newInstance).toHaveBeenCalledWith(propertyName, undefined);
  });

  it('should throw error if the target is not a constructor', () => {
    expect(() => {
      inject()(Mocks.object('target'), 'propertyName', 12);
    }).toThrowError(/is not a constructor/);
  });
});
