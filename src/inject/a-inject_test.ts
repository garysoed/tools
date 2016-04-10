import TestBase from '../test-base';
TestBase.setup();

import Inject from './a-inject';
import Injector from './injector';
import Mocks from '../mock/mocks';

class TestClass {}


describe('inject.Inject', () => {
  it('should register the parameter correctly', () => {
    let name = 'name';
    let propertyName = 'propertyName';
    let index = 12;

    spyOn(Injector, 'registerInject');

    Inject(name)(TestClass, propertyName, index);

    expect(Injector.registerInject).toHaveBeenCalledWith(name, TestClass, index);
  });

  it('should use the parameter name if not specified', () => {
    let propertyName = 'propertyName';
    let index = 12;

    spyOn(Injector, 'registerInject');

    Inject()(TestClass, propertyName, index);

    expect(Injector.registerInject).toHaveBeenCalledWith(propertyName, TestClass, index);
  });

  it('should throw error if the target is not a constructor', () => {
    expect(() => {
      Inject()(Mocks.object('target'), 'propertyName', 12);
    }).toThrowError(/is not a constructor/);
  });
});
