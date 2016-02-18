import Disposable from './src/dispose/testing/test-base';

let initialized = false;

export default {
  setup() {
    if (!initialized) {
      Disposable.setup(window);
      initialized = true;
    }
  }
};
