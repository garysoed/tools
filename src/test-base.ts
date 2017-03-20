import { TestAsync } from './testing/test-async';
import { TestDispose } from './testing/test-dispose';
import { TestEvent } from './testing/test-event';
import { TestJasmine } from './testing/test-jasmine';
import { TestSetup } from './testing/test-setup';


export { assert } from './jasmine/assert';
export { Matchers } from './jasmine/matchers';


const TEST_SETUP = new TestSetup([
  TestAsync,
  TestDispose,
  TestEvent,
  TestJasmine,
]);

let initialized = false;

export const TestBase = {
  setup(): void {
    if (!initialized) {
      TEST_SETUP.setup();
      initialized = true;
    }
  },
};
