import { cache } from '../data';
import { AssertionError } from '../error';

export class Gapi {
  private readonly discoveryDocs_: Set<string> = new Set();
  private initialized_: boolean = false;
  private readonly scopes_: Set<string> = new Set();
  private signIn_: boolean = false;

  constructor(
      private readonly apiKey_: string,
      private readonly clientId_: string) { }

  addDiscoveryDocs(docs: string[]): void {
    if (this.initialized_) {
      throw AssertionError.condition('initialized', 'be false', this.initialized_);
    }

    for (const doc of docs) {
      this.discoveryDocs_.add(doc);
    }
  }

  addScopes(scopes: string[]): void {
    if (this.initialized_) {
      throw AssertionError.condition('initialized', 'be false', this.initialized_);
    }

    for (const scope of scopes) {
      this.scopes_.add(scope);
    }
  }

  addSignIn(): void {
    if (this.initialized_) {
      throw AssertionError.condition('initialized', 'be false', this.initialized_);
    }

    this.signIn_ = true;
  }

  @cache()
  async init(): Promise<gapi.Client> {
    await new Promise((resolve: () => void) => {
      gapi.load('client:auth2', () => {
        resolve();
      });
    });
    await gapi.client.init({
      apiKey: this.apiKey_,
      clientId: this.clientId_,
      discoveryDocs: [...this.discoveryDocs_],
      scope: [...this.scopes_].join(' '),
    });

    if (this.signIn_) {
      await gapi.auth2.getAuthInstance().signIn();
    }
    this.initialized_ = true;
    return gapi.client;
  }
}
