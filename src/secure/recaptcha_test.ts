import { assert, Matchers, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';

import { EventType, Recaptcha } from './recaptcha';


describe('secure.Recaptcha', () => {
  const SITEKEY = 'sitekey';
  const WIDGET_ID = 'widgetId';
  let recaptcha: Recaptcha;
  let mockElement: any;
  let mockGrecaptcha: any;

  beforeEach(() => {
    mockElement = Mocks.object('Element');
    mockGrecaptcha = createSpyObject('Grecaptcha', ['getResponse', 'render', 'reset']);
    mockGrecaptcha.render.and.returnValue(WIDGET_ID);

    recaptcha = Recaptcha.newInstance(mockGrecaptcha, mockElement, SITEKEY);
    TestDispose.add(recaptcha);
  });

  should('call render correctly', () => {
    const callback = createSpy('Callback');

    assert(mockGrecaptcha.render).to.haveBeenCalledWith(mockElement, {
      callback: Matchers.anyFunction(),
      sitekey: SITEKEY,
    });

    TestDispose.add(recaptcha.on(EventType.NEW_RESPONSE, callback, window));

    mockGrecaptcha.render.calls.argsFor(0)[1].callback();
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
      mockGrecaptcha.getResponse.and.returnValue(response);
      assert(recaptcha.getResponse()).to.equal(response);
      assert(mockGrecaptcha.getResponse).to.haveBeenCalledWith(WIDGET_ID);
    });
  });
});
