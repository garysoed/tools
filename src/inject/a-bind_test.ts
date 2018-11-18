import { assert, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { bind } from './a-bind';
import { Injector } from './injector';


class TestClass { }

describe('inject.Bind', () => {
  should('bind the constructor correctly', () => {
    const name = 'name';

    spyOn(Injector, 'bind');

    bind(name)(TestClass);
    assert(Injector.bind).to.haveBeenCalledWith(TestClass, name);
  });

  should('use the constructor name if the name is not given', () => {
    spyOn(Injector, 'bind');

    bind()(TestClass);
    assert(Injector.bind).to.haveBeenCalledWith(TestClass, 'TestClass');
  });
});
