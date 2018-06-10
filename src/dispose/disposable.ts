export interface Disposable {
  /**
   * Dispose this object.
   */
  dispose(): void;

  /**
   * @return True iff the object has been disposed.
   */
  isDisposed(): boolean;
}
