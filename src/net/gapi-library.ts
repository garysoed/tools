import { Errors } from '../error';
import { ImmutableMap } from '../immutable';
import { Gapi } from '../net/gapi';
import { GapiError } from '../net/gapi-error';
import { SimpleIdGenerator } from '../random';

type Callback<T> = (result: T | Error) => void;

export const QUEUED_REQUESTS: Map<gapi.client.HttpRequest<any>, Callback<any>> = new Map();
const QUEUE_TIMEOUT_MS: number = 10;

export class GapiLibrary<T> {
  private static timeoutId_: null | number = null;

  constructor(
      private readonly gapi_: Gapi,
      private readonly name_: string,
      private readonly window_: Window = window) { }

  client(): Promise<gapi.Client> {
    return this.gapi_.init();
  }

  async flushRequests_(): Promise<void> {
    const client = await this.client();
    const batch = client.newBatch();
    const idGenerator = new SimpleIdGenerator();
    const callbackMap: Map<string, Callback<any>> = new Map();

    if (GapiLibrary.timeoutId_ !== null) {
      this.window_.clearTimeout(GapiLibrary.timeoutId_);
      GapiLibrary.timeoutId_ = null;
    }

    for (const [request, callback] of QUEUED_REQUESTS) {
      const id = idGenerator.generate(callbackMap.keys());
      batch.add(request, {id});
      callbackMap.set(id, callback);
    }

    QUEUED_REQUESTS.clear();

    const batchResponse = await batch;
    if (batchResponse.status !== 200) {
      const error = new GapiError(batchResponse);
      for (const callback of callbackMap.values()) {
        callback(error);
      }
      return;
    }

    for (const [id, response] of ImmutableMap.of(batchResponse.result)) {
      const callback = callbackMap.get(id);
      if (!callback) {
        continue;
      }

      if (response.status !== 200) {
        callback(new GapiError(response));
        continue;
      }

      callback(response.result);
    }
  }

  async get(): Promise<T> {
    const client = await this.client();
    const obj = client[this.name_];
    if (!obj) {
      throw Errors.assert(`gapi.${this.name_}`).shouldExist().butWas(obj);
    }
    return obj;
  }

  queueRequest<T>(request: gapi.client.HttpRequest<T>): Promise<T> {
    if (GapiLibrary.timeoutId_ === null) {
      GapiLibrary.timeoutId_ = this.window_.setTimeout(() => {
        this.flushRequests_();
      }, QUEUE_TIMEOUT_MS);
    }

    return new Promise((resolve, reject) => {
      QUEUED_REQUESTS.set(request, (result) => {
        if (result instanceof Error) {
          reject(result);
        } else {
          resolve(result);
        }
      });
    });
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
