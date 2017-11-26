import { TestGraph } from './graph';
import { TestAsync, TestDispose, TestEvent, TestJasmine, TestSetup } from './testing';
import { Log, LogLevel } from './util/log';
export { assert } from './jasmine/assert';
export { assertColor } from './jasmine/assert-color';
export { Matchers } from './jasmine/matchers';
export { Fakes } from './mock/fakes';
export { Mocks } from './mock/mocks';

const TEST_SETUP = new TestSetup([
  TestAsync,
  TestDispose,
  TestEvent,
  TestGraph,
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
