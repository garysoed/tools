import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ANNOTATIONS, eventDetails } from '../event/event-details';


class TestClass { }

describe('event.eventDetails', () => {
  it('should add the annotation correctly', () => {
    const method = 'method';
    const index = 3;
    eventDetails()(TestClass.prototype, method, index);
    assert(ANNOTATIONS.forCtor(TestClass).getAttachedValues().get(method)!)
        .to.haveElements([index]);
  });
});
