import { assert, should } from 'gs-testing/export/main';
import { spy } from 'gs-testing/export/spy';
import { bind } from './a-bind';
import { Injector } from './injector';


class TestClass { }

describe('inject.Bind', () => {
  should('bind the constructor correctly', () => {
    const name = 'name';
    const bindSpy = spy(Injector, 'bind');

    bind(name)(TestClass);
    assert(bindSpy).to.haveBeenCalledWith(TestClass, name);
  });

  should('use the constructor name if the name is not given', () => {
    const bindSpy = spy(Injector, 'bind');

    bind()(TestClass);
    assert(bindSpy).to.haveBeenCalledWith(TestClass, 'TestClass');
  });
});
