import { assert, should, test, setup, match, Spy, createSpy, fake, spy } from '@gs-testing';
import { Builder } from './builder';
import { ReplaySubject } from '@rxjs';
import { take } from '@rxjs/operators';

test('@gs-tools/gapi/builder', () => {
  const API_KEY = 'apiKey';
  const CLIENT_ID = 'clientId';
  let builder: Builder;
  let mockGapiClientInit: Spy;

  setup(() => {
    const mockGapiLoad = createSpy<any, [string, Function]>('gapi.load');
    fake(mockGapiLoad).always().call((_, handler) => handler());

    mockGapiClientInit = createSpy('gapi.client.init');
    fake(mockGapiClientInit).always().return(Promise.resolve());

    builder = new Builder(API_KEY, CLIENT_ID, 'url');

    Object.assign(window, {
      gapi: {
        client: {init: mockGapiClientInit},
        load: mockGapiLoad,
      },
    });
  });

  should(`build correctly`, async () => {
    const discoveryDoc = 'discoveryDoc';
    const SCOPE1 = 'scope1';
    const SCOPE2 = 'scope2';

    const scriptEl = document.createElement('script');
    fake(spy(document, 'createElement')).always().return(scriptEl);

    const subject = new ReplaySubject(1);
    builder
        .addLibrary({
          discoveryDoc,
          scopes: [SCOPE1, SCOPE2],
        })
        .build()
        .subscribe(subject);

    scriptEl.onload!(new CustomEvent('load'));

    await subject.pipe(take(1)).toPromise();
    assert(mockGapiClientInit).to.haveBeenCalledWith(match.anyObjectThat().haveProperties({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: match.anyArrayThat().haveExactElements([discoveryDoc]),
      scope: `${SCOPE1} ${SCOPE2}`,
    }));
  });
});
