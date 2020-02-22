import { from, Observable } from 'rxjs';
import { mapTo, shareReplay } from 'rxjs/operators';

import { Handler } from './handler';

interface Library {
  discoveryDoc: string;
  scopes: string[];
}

export class Builder {
  private readonly discoveryDocs = [] as string[];
  private readonly scopes = [] as string[];

  constructor(
      private readonly apiKey: string,
      private readonly clientId: string,
  ) { }

  addLibrary({discoveryDoc, scopes}: Library): this {
    this.discoveryDocs.push(discoveryDoc);
    this.scopes.push(...scopes);

    return this;
  }

  build(): Observable<Handler> {
    return from<Promise<void>>(new Promise((resolve, reject) => {
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
            shareReplay(1),
        );
  }
}

