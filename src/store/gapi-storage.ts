import { ImmutableSet } from '../immutable';
import { GapiLibrary } from '../net';
import { ReadableStorage } from './readable-storage';

export type GapiRequestQueue<API, T> = (fn: (api: API) => gapi.client.HttpRequest<T>) => Promise<T>;

export abstract class GapiStorage<
    API,
    HAS,
    LIST,
    LIST_ID,
    READ,
    FULL,
    SUMMARY = FULL> implements ReadableStorage<FULL, SUMMARY> {
  constructor(private readonly lib_: GapiLibrary<API>) { }

  has(id: string): Promise<boolean> {
    return this.hasImpl_(fn => this.queueRequest_(fn), id);
  }

  abstract hasImpl_(queueRequest: GapiRequestQueue<API, HAS>, id: string):
      Promise<boolean>;

  list(): Promise<ImmutableSet<SUMMARY>> {
    return this.listImpl_(fn => this.queueRequest_(fn));
  }

  listIds(): Promise<ImmutableSet<string>> {
    return this.listIdsImpl_(fn => this.queueRequest_(fn));
  }

  protected abstract listIdsImpl_(queueRequest: GapiRequestQueue<API, LIST_ID>):
      Promise<ImmutableSet<string>>;

  protected abstract listImpl_(queueRequest: GapiRequestQueue<API, LIST>):
      Promise<ImmutableSet<SUMMARY>>;

  async queueRequest_<T>(fn: (api: API) => gapi.client.HttpRequest<T>): Promise<T> {
    const lib = await this.lib_.get();

    return this.lib_.queueRequest(fn(lib));
  }

  read(id: string): Promise<FULL | null> {
    return this.readImpl_(fn => this.queueRequest_(fn), id);
  }

  protected abstract readImpl_(queueRequest: GapiRequestQueue<API, READ>, id: string):
      Promise<FULL | null>;
}
