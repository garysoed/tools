import DisposableFunction from '../dispose/disposable-function';

export default {
  create(): any {
    return {
      $apply(): void {
        return undefined;
      },

      $on(): (() => void) {
        let disposableFunction = new DisposableFunction(() => undefined);
        return () => {
          disposableFunction.dispose();
        };
      },

      $watch(): (() => void) {
        let disposableFunction = new DisposableFunction(() => undefined);
        return () => {
          disposableFunction.dispose();
        };
      },
    };
  },
};
