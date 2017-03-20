import { assert, TestBase } from '../test-base';
TestBase.setup();

import { bind } from './a-bind';
import { Injector } from './injector';


class TestClass { }

describe('inject.Bind', () => {
  it('should bind the constructor correctly', () => {
    let name = 'name';

    spyOn(Injector, 'bind');

    bind(name)(TestClass);
    assert(Injector.bind).to.haveBeenCalledWith(TestClass, name);
  });

  it('should use the constructor name if the name is not given', () => {
    spyOn(Injector, 'bind');

    bind()(TestClass);
    assert(Injector.bind).to.haveBeenCalledWith(TestClass, 'TestClass');
  });
});
