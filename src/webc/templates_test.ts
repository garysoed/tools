import {TestBase} from '../test-base';
TestBase.setup();

import {Templates} from './templates';


describe('webc.Templates', () => {
  let replacementMap;
  let templates;

  beforeEach(() => {
    Templates['templates_'].clear();

    replacementMap = new Map<RegExp, string>();
    templates = Templates.newInstance(replacementMap);
  });

  describe('getTemplate', () => {
    fit('should use the replacement map to replace the strings in the template', () => {
      let key = 'key';
      Templates.register(key, '123234');
      replacementMap.set(/2/g, 'two');
      replacementMap.set(/3/, 'three');

      expect(templates.getTemplate(key)).toEqual('1twothreetwo34');
    });

    fit('should return null if the templates map does not have the requested key', () => {
      expect(templates.getTemplate('key')).toEqual(null);
    });
  });

  describe('register', () => {
    it('should register the template', () => {
      let key = 'key';
      let templateString = 'templateString';

      Templates.register(key, templateString);

      let templates = Templates.newInstance();
      expect(templates.getTemplate(key)).toEqual(templateString);
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
