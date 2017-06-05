import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ANNOTATIONS } from '../event/monad';
import { monadOut } from '../event/monad-out';
import { Mocks } from '../mock/mocks';


class TestClass { }

describe('event.monadOut', () => {
  it('should add the annotation correctly', () => {
    const id = Mocks.object('id');
    const factory = Mocks.object('factory');
    const method = 'method';
    const index = 3;
    monadOut(factory)(TestClass.prototype, method, index);
    assert(ANNOTATIONS.forCtor(TestClass).getAttachedValues().get(method)!)
        .to.haveElements([{factory, index, setter: true}]);
  });
});
