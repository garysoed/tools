import ITestSetup from './i-test-setup';

export default class TestSetup {
  private setups_: ITestSetup[];

  constructor(setups: ITestSetup[]) {
    this.setups_ = setups;
  }

  setup(): void {
    beforeEach(() => {
      this.setups_.forEach((setup: ITestSetup) => {
        setup.beforeEach();
      });
    });

    afterEach(() => {
      this.setups_.forEach((setup: ITestSetup) => {
        setup.afterEach();
      });
    });
  }
};
