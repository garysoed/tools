export default {
  run<T>(fn: () => T): Promise<T> {
    return new Promise((resolve: Function) => {
      window.setTimeout(() => {
        resolve(fn());
      }, 0);
    });
  },
}
