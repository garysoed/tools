import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ANNOTATIONS, monad } from '../event/monad';
import { Mocks } from '../mock/mocks';


class TestClass { }

describe('event.Monad', () => {
  it('should add the annotation correctly', () => {
    const factory = () => Mocks.object('monad');
    const method = 'method';
    const index = 3;
    monad(factory)(TestClass.prototype, method, index);
    assert(ANNOTATIONS.forCtor(TestClass).getAttachedValues().get(method)!)
        .to.haveElements([{factory, index, setter: false}]);
  });

  it(`should add monads correctly`, () => {
    const monadObj = Mocks.object('monad');
    const method = 'method';
    const index = 3;
    monad(monadObj)(TestClass.prototype, method, index);
    const configs = ANNOTATIONS.forCtor(TestClass).getAttachedValues().get(method)!;
    assert([...configs][0].factory(Mocks.object('instance'))).to.equal(monadObj);
  });
});
