import { assert, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { ANNOTATIONS, eventDetails } from '../event/event-details';

/**
 * @test
 */
class TestClass { }

describe('event.eventDetails', () => {
  should('add the annotation correctly', () => {
    const method = 'method';
    const index = 3;
    eventDetails()(TestClass.prototype, method, index);
    assert(ANNOTATIONS.forCtor(TestClass).getAttachedValues().get(method))
        .to.haveElements([index]);
  });
});
