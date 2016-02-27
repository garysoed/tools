export default class MockElement {
  private queries_: { [query: string]: any };

  constructor(queries: { [query: string]: any }) {
    this.queries_ = queries;
  }

  addEventListener(): void {
    // Noop
  }

  removeEventListener(): void {
    // Noop
  }

  querySelector(query: string): any {
    return this.queries_[query];
  }
}
