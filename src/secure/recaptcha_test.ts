import { assert, match, should } from 'gs-testing/export/main';
import { mocks } from 'gs-testing/export/mock';
import { createSpy, createSpyObject, fake, SpyObj } from 'gs-testing/export/spy';
import { Recaptcha } from './recaptcha';


describe('secure.Recaptcha', () => {
  const SITEKEY = 'sitekey';
  const WIDGET_ID = 123;
  let recaptcha: Recaptcha;
  let mockElement: any;
  let mockGrecaptcha: SpyObj<ReCaptchaV2.ReCaptcha>;

  beforeEach(() => {
    mockElement = mocks.object('Element');
    mockGrecaptcha = createSpyObject('Grecaptcha', ['getResponse', 'render', 'reset']);
    fake(mockGrecaptcha.render).always().return(WIDGET_ID);

    recaptcha = Recaptcha.newInstance(mockGrecaptcha, mockElement, SITEKEY);
  });

  should('call render correctly', () => {
    const callback = createSpy('Callback');

    const callbackMatch = match.anyObjectThat<() => void>().beAFunction();
    assert(mockGrecaptcha.render).to.haveBeenCalledWith(
        mockElement,
        match.anyObjectThat<ReCaptchaV2.Parameters>().haveProperties({
          callback: callbackMatch,
          sitekey: SITEKEY,
        }));

    callbackMatch.getLastMatch()();
    assert(callback).to.haveBeenCalledWith(null);
  });

  describe('reset', () => {
    should('reset the recaptcha widget', () => {
      recaptcha.reset();
      assert(mockGrecaptcha.reset).to.haveBeenCalledWith(WIDGET_ID);
    });
  });

  describe('response', () => {
    should('return the response from the widget', () => {
      const response = 'response';
      fake(mockGrecaptcha.getResponse).always().return(response);
      assert(recaptcha.getResponse()).to.equal(response);
      assert(mockGrecaptcha.getResponse).to.haveBeenCalledWith(WIDGET_ID);
    });
  });
});
