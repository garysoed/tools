import {TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';
import {EventType, Recaptcha} from './recaptcha';
import {TestDispose} from '../testing/test-dispose';


describe('secure.Recaptcha', () => {
  const SITEKEY = 'sitekey';
  const WIDGET_ID = 'widgetId';
  let recaptcha;
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

    expect(mockGrecaptcha.render).toHaveBeenCalledWith(mockElement, {
      callback: jasmine.any(Function),
      sitekey: SITEKEY,
    });

    TestDispose.add(recaptcha.on(EventType.NEW_RESPONSE, callback));

    mockGrecaptcha.render.calls.argsFor(0)[1].callback();
    expect(callback).toHaveBeenCalledWith(null);
  });

  describe('reset', () => {
    it('should reset the recaptcha widget', () => {
      recaptcha.reset();
      expect(mockGrecaptcha.reset).toHaveBeenCalledWith(WIDGET_ID);
    });
  });

  describe('response', () => {
    it('should return the response from the widget', () => {
      let response = 'response';
      mockGrecaptcha.getResponse.and.returnValue(response);
      expect(recaptcha.response).toEqual(response);
      expect(mockGrecaptcha.getResponse).toHaveBeenCalledWith(WIDGET_ID);
    });
  });
});
