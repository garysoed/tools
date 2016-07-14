import {TestBase} from '../test-base';
TestBase.setup();

import Bind from './a-bind';
import {Injector} from './injector';


class TestClass { }

describe('inject.Bind', () => {
  it('should bind the constructor correctly', () => {
    let name = 'name';

    spyOn(Injector, 'bind');

    Bind(name)(TestClass);
    expect(Injector.bind).toHaveBeenCalledWith(TestClass, name);
  });

  it('should use the constructor name if the name is not given', () => {
    spyOn(Injector, 'bind');

    Bind()(TestClass);
    expect(Injector.bind).toHaveBeenCalledWith(TestClass, 'TestClass');
  });
});
