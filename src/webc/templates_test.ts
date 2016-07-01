import TestBase from '../test-base';
TestBase.setup();

import {Templates} from './templates';


describe('webc.Templates', () => {
  beforeEach(() => {
    Templates['templates_'].clear();
  });

  describe('register', () => {
    it('should register the template', () => {
      let key = 'key';
      let templateString = 'templateString';

      Templates.register(key, templateString);
      expect(Templates.getTemplate(key)).toEqual(templateString);
    });

    it('should throw error if the key has already been registered', () => {
      let key = 'key';

      Templates.register(key, 'templateString1');

      expect(() => {
        Templates.register(key, 'templateString2');
      }).toThrowError(/is already registered/);
    });
  });
});
