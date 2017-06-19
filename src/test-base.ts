import { TestAsync } from './testing/test-async';
import { TestDispose } from './testing/test-dispose';
import { TestEvent } from './testing/test-event';
import { TestJasmine } from './testing/test-jasmine';
import { TestSetup } from './testing/test-setup';
import { Log, LogLevel } from './util/log';
export { assert } from './jasmine/assert';
export { assertColor } from './jasmine/assert-color';
export { gentest } from './testgen/gentest';
export { Matchers } from './jasmine/matchers';
export { TestSpec } from './testgen/test-spec';

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
      Log.setEnabledLevel(LogLevel.OFF);
      initialized = true;
    }
  },
};
