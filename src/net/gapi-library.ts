import { AssertionError } from '../error';
import { Gapi } from '../net/gapi';

export class GapiLibrary<T> {
  constructor(
      private readonly gapi_: Gapi,
      private readonly name_: string) { }
  async get(): Promise<T> {
    const client = await this.gapi_.init();
    const obj = client[this.name_];
    if (!obj) {
      throw AssertionError.condition(`gapi.${this.name_}`, 'to exist', obj);
    }
    return obj;
  }

  static create<T>(
      gapi: Gapi,
      discoveryDocs: string[],
      scopes: string[],
      name: string,
      signIn: boolean = false): GapiLibrary<T> {
    gapi.addScopes(scopes);
    gapi.addDiscoveryDocs(discoveryDocs);
    if (signIn) {
      gapi.addSignIn();
    }
    return new GapiLibrary(gapi, name);
  }
}
