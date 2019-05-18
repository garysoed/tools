import { from, Observable } from '@rxjs';
import { mapTo, shareReplay, switchMap } from '@rxjs/operators';
import { Handler } from './handler';

interface Library {
  discoveryDoc: string,
  scopes: string[],
}

const GAPI_URL = 'https://apis.google.com/js/api.js';

export class Builder {
  private readonly discoveryDocs = [] as string[];
  private readonly scopes = [] as string[];

  constructor(
      private readonly apiKey: string,
      private readonly clientId: string,
      private readonly apiUrl = GAPI_URL,
  ) { }

  addLibrary({discoveryDoc, scopes}: Library): this {
    this.discoveryDocs.push(discoveryDoc);
    this.scopes.push(...scopes);

    return this;
  }

  build(): Observable<Handler> {
    return from<Promise<void>>(new Promise(resolve => {
          const scriptEl = document.createElement('script');
          scriptEl.onload = () => resolve();
          scriptEl.src = this.apiUrl;
          document.head.appendChild(scriptEl);
        }))
        .pipe(
            switchMap(() => from<Promise<void>>(new Promise((resolve, reject) => {
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
              })
            }))),
            mapTo(new Handler()),
            shareReplay(1),
        );
  }
}

