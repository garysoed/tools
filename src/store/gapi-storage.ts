import { from, Observable } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { ImmutableSet } from '../immutable';
import { GapiLibrary } from '../net';
import { ReadableStorage } from './readable-storage';

export type GapiRequestQueue<API, T> =
    (createRequest: (api: API) => gapi.client.HttpRequest<T>) => Observable<T>;

export abstract class GapiStorage<
    API,
    HAS,
    LIST_ID,
    READ,
    FULL,
    SUMMARY = FULL> implements ReadableStorage<FULL, SUMMARY> {
  constructor(private readonly lib_: GapiLibrary<API>) { }

  has(id: string): Observable<boolean> {
    return this.hasImpl_(fn => this.queueRequest_(fn), id);
  }

  protected abstract hasImpl_(queueRequest: GapiRequestQueue<API, HAS>, id: string):
      Observable<boolean>;

  listIds(): Observable<ImmutableSet<string>> {
    return this.listIdsImpl_(fn => this.queueRequest_(fn));
  }

  protected abstract listIdsImpl_(queueRequest: GapiRequestQueue<API, LIST_ID>):
      Observable<ImmutableSet<string>>;

  private queueRequest_<T>(createRequest: (api: API) => gapi.client.HttpRequest<T>): Observable<T> {
    return from(this.lib_.get())
        .pipe(
            switchMap(lib => from(this.lib_.queueRequest(createRequest(lib)))),
            shareReplay(1),
        );
  }

  read(id: string): Observable<FULL|null> {
    return this.readImpl_(fn => this.queueRequest_(fn), id);
  }

  protected abstract readImpl_(queueRequest: GapiRequestQueue<API, READ>, id: string):
      Observable<FULL|null>;
}
