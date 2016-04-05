/**
 * Fake implementation of an HTMLElement.
 */
class MockElement {
  private queries_: { [query: string]: any };

  /**
   * @param queries Used to implement [[querySelector]]. The key is the query, and the value is the
   *    value(s) to return for the query.
   */
  constructor(queries: { [query: string]: any }) {
    this.queries_ = queries;
  }

  /**
   * Stub implementation.
   */
  addEventListener(): void {
    // Noop
  }

  /**
   * Stub implementation.
   */
  removeEventListener(): void {
    // Noop
  }

  /**
   * Fake implementation of HTMLElement's query selector, based on the mapping provided in the
   * constructor.
   *
   * @param query The query to use.
   * @return The value corresponding to the query, as stored in the map given in the constructor.
   */
  querySelector(query: string): any {
    return this.queries_[query];
  }
}

export default MockElement;
