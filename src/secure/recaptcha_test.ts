import TestBase from '../test-base';
TestBase.setup();

import Mocks from '../mock/mocks';
import Recaptcha from './recaptcha';


describe('secure.Recaptcha', () => {
  const WIDGET_ID = 1234;
  let recaptcha;
  let mockGrecaptcha;

  beforeEach(() => {
    mockGrecaptcha = jasmine.createSpyObj('Grecaptcha', ['getResponse', 'render', 'reset']);
    recaptcha = new Recaptcha(mockGrecaptcha, WIDGET_ID);
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

  describe('newInstance', () => {
    it('should create a new instance of the recaptcha', () => {
      let mockElement = Mocks.object('Element');
      let mockParams = Mocks.object('Params');
      let widgetId = 'widgetId';

      mockGrecaptcha.render.and.returnValue(widgetId);

      let recaptcha = Recaptcha.newInstance(mockGrecaptcha, mockElement, mockParams);
      expect(recaptcha['widgetId_']).toEqual(widgetId);
    });
  });
});
