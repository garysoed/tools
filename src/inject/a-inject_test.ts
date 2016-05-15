import TestBase from '../test-base';
TestBase.setup();

import Inject from './a-inject';
import Mocks from '../mock/mocks';
import Records from '../collection/records';

class TestClass {}


describe('inject.Inject', () => {
  it('should register the parameter correctly', () => {
    let name = 'name';
    let index = 12;
    let fakeMetadata = new Map<number, string>();

    spyOn(Inject, 'getMetadata').and.returnValue(fakeMetadata);

    Inject(name)(TestClass, 'propertyName', index);

    expect(Records.fromMap(fakeMetadata).data).toEqual({[index]: name});
  });

  it('should use the parameter name if not specified', () => {
    let propertyName = 'propertyName';
    let index = 12;
    let fakeMetadata = new Map<number, string>();

    spyOn(Inject, 'getMetadata').and.returnValue(fakeMetadata);

    Inject()(TestClass, propertyName, index);

    expect(Records.fromMap(fakeMetadata).data).toEqual({[index]: propertyName});
  });

  it('should throw error if the target is not a constructor', () => {
    expect(() => {
      Inject()(Mocks.object('target'), 'propertyName', 12);
    }).toThrowError(/is not a constructor/);
  });
});
