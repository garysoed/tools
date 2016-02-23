import TestAsync from './testing/test-async';
import TestDispose from './testing/test-dispose';
import TestEvent from './testing/test-event';
import TestSetup from './testing/test-setup';


const TEST_SETUP = new TestSetup([
  TestAsync,
  TestDispose,
  TestEvent,
]);

let initialized = false;

export default {
  setup(): void {
    if (!initialized) {
      TEST_SETUP.setup();
      initialized = true;
    }
  },
};
