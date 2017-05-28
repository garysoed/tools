import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ANNOTATIONS, event } from '../event/event';


class TestClass { }

describe('event.event', () => {
  it('should add the annotation correctly', () => {
    const method = 'method';
    const index = 3;
    event()(TestClass.prototype, method, index);
    assert(ANNOTATIONS.forCtor(TestClass).getAttachedValues().get(method)!)
        .to.haveElements([index]);
  });
});
