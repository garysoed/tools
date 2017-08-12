import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ANNOTATIONS } from '../event/monad';
import { monadOut } from '../event/monad-out';
import { Mocks } from '../mock/mocks';


class TestClass { }

describe('event.monadOut', () => {
  it('should add the annotation correctly', () => {
    const factory = () => Mocks.object('monad');
    const method = 'method';
    const index = 3;
    monadOut(factory)(TestClass.prototype, method, index);
    assert(ANNOTATIONS.forCtor(TestClass).getAttachedValues().get(method)!)
        .to.haveElements([{factory, index, setter: true}]);
  });

    it(`should add monads correctly`, () => {
      const monadObj = Mocks.object('monad');
      const method = 'method';
      const index = 3;
      monadOut(monadObj)(TestClass.prototype, method, index);
      const configs = ANNOTATIONS.forCtor(TestClass).getAttachedValues().get(method)!;
      assert([...configs][0].factory(Mocks.object('instance'))).to.equal(monadObj);
    });
});
