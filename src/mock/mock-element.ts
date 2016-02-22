export default class MockElement {
  private queries_: { [query: string]: any };

  constructor(queries: { [query: string]: any }) {
    this.queries_ = queries;
  }

  addEventListener() {
    // Noop
  }

  removeEventListener() {
    // Noop
  }

  querySelector(query): any {
    return this.queries_[query];
  }
}
