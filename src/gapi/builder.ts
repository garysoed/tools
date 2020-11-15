import {Observable, defer} from 'rxjs';
import {mapTo, shareReplay} from 'rxjs/operators';

import {Handler} from './handler';


/**
 * Represents Google API library.
 *
 * @thHidden
 */
export interface Library {
  /**
   * Discovery doc string.
   */
  readonly discoveryDoc: string;

  /**
   * Scopes to be used for accessing the library.
   */
  readonly scopes: readonly string[];
}

/**
 * Use this to build the Google API library.
 *
 * @thModule gapi
 */
export class Builder {
  private readonly discoveryDocs = [] as string[];
  private readonly scopes = [] as string[];

  /**
   * @param apiKey - The API key.
   * @param clientId - Client ID of the app.
   */
  constructor(
      private readonly apiKey: string,
      private readonly clientId: string,
  ) { }

  /**
   * Adds a Google library to the API.
   *
   * @param param0 - Library to be added
   * @returns The builder for chaining.
   */
  addLibrary({discoveryDoc, scopes}: Library): this {
    this.discoveryDocs.push(discoveryDoc);
    this.scopes.push(...scopes);

    return this;
  }

  /**
   * Builds the Google API.
   *
   * @returns Observable that emits Handler for using Google API.
   */
  build(): Observable<Handler> {
    return defer(async () => new Promise((resolve, reject) => {
      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            apiKey: this.apiKey,
            clientId: this.clientId,
            discoveryDocs: this.discoveryDocs,
            scope: this.scopes.join(' '),
          });
        } catch (e) {
          reject(e);
        }

        resolve();
      });
    }))
        .pipe(
            mapTo(new Handler()),
            shareReplay({bufferSize: 1, refCount: true}),
        );
  }
}

