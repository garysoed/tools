import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';

import { EventType, Recaptcha } from './recaptcha';


describe('secure.Recaptcha', () => {
  const SITEKEY = 'sitekey';
  const WIDGET_ID = 'widgetId';
  let recaptcha: Recaptcha;
  let mockElement;
  let mockGrecaptcha;

  beforeEach(() => {
    mockElement = Mocks.object('Element');
    mockGrecaptcha = jasmine.createSpyObj('Grecaptcha', ['getResponse', 'render', 'reset']);
    mockGrecaptcha.render.and.returnValue(WIDGET_ID);

    recaptcha = Recaptcha.newInstance(mockGrecaptcha, mockElement, SITEKEY);
    TestDispose.add(recaptcha);
  });

  it('should call render correctly', () => {
    let callback = jasmine.createSpy('Callback');

    assert(mockGrecaptcha.render).to.haveBeenCalledWith(mockElement, {
      callback: Matchers.any(Function),
      sitekey: SITEKEY,
    });

    TestDispose.add(recaptcha.on(EventType.NEW_RESPONSE, callback, this));

    mockGrecaptcha.render.calls.argsFor(0)[1].callback();
    assert(callback).to.haveBeenCalledWith(null);
  });

  describe('reset', () => {
    it('should reset the recaptcha widget', () => {
      recaptcha.reset();
      assert(mockGrecaptcha.reset).to.haveBeenCalledWith(WIDGET_ID);
    });
  });

  describe('response', () => {
    it('should return the response from the widget', () => {
      let response = 'response';
      mockGrecaptcha.getResponse.and.returnValue(response);
      assert(recaptcha.getResponse()).to.equal(response);
      assert(mockGrecaptcha.getResponse).to.haveBeenCalledWith(WIDGET_ID);
    });
  });
});
