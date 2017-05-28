import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ANNOTATIONS, monad } from '../event/monad';
import { Mocks } from '../mock/mocks';


class TestClass { }

describe('event.Monad', () => {
  it('should add the annotation correctly', () => {
    const factory = Mocks.object('factory');
    const method = 'method';
    const index = 3;
    monad(factory)(TestClass.prototype, method, index);
    assert(ANNOTATIONS.forCtor(TestClass).getAttachedValues().get(method)!)
        .to.haveElements([{factory, index}]);
  });
});
