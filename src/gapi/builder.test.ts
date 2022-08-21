import {arrayThat, assert, createSpy, fake, objectThat, should, test, setup} from 'gs-testing';
import {take} from 'rxjs/operators';

import {Builder} from './builder';


test('@gs-tools/gapi/builder', () => {
  const API_KEY = 'apiKey';
  const CLIENT_ID = 'clientId';

  const _ = setup(() => {
    const mockGapiLoad = createSpy<any, [string, (...args: any[]) => unknown]>('gapi.load');
    fake(mockGapiLoad).always().call((_, handler) => handler());

    const mockGapiClientInit = createSpy('gapi.client.init');
    fake(mockGapiClientInit).always().return(Promise.resolve());

    const builder = new Builder(API_KEY, CLIENT_ID);

    Object.assign(window, {
      gapi: {
        client: {init: mockGapiClientInit},
        load: mockGapiLoad,
      },
    });

    return {builder, mockGapiClientInit};
  });

  should('build correctly', async () => {
    const discoveryDoc = 'discoveryDoc';
    const SCOPE1 = 'scope1';
    const SCOPE2 = 'scope2';

    const gapi$ = _.builder
        .addLibrary({
          discoveryDoc,
          scopes: [SCOPE1, SCOPE2],
        })
        .build();

    await gapi$.pipe(take(1)).toPromise();
    assert(_.mockGapiClientInit).to.haveBeenCalledWith(objectThat().haveProperties({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: arrayThat().haveExactElements([discoveryDoc]),
      scope: `${SCOPE1} ${SCOPE2}`,
    }));
  });
});
