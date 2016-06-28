import TestBase from '../test-base';
TestBase.setup();

import {BaseElement} from './base-element';
import {CustomElement} from './custom-element';
import {Mocks} from '../mock/mocks';


describe('webc.CustomElement', () => {
  let mockXtag;

  beforeEach(() => {
    mockXtag = Mocks.object('Xtag');
    window['xtag'] = mockXtag;
  });

  it('should bind the constructor correctly', () => {
    class TestElement extends BaseElement { }

    let config = {tag: 'tag', templateUrl: 'templateUrl'};

    CustomElement(config)(TestElement);
    expect(CustomElement.getConfig(TestElement)).toEqual(config);
  });

  it('should throw exception if the constructor does not extend BaseElement', () => {
    class TestElement { }

    expect(() => {
      CustomElement({tag: 'tag', templateUrl: 'templateUrl'})(TestElement);
    }).toThrowError(/extend BaseElement/);
  });

  it('should throw error if the tag name is empty', () => {
    class TestElement extends BaseElement { }

    expect(() => {
      CustomElement({tag: '', templateUrl: 'templateUrl'})(TestElement);
    }).toThrowError(/non empty tag name/);
  });

  it('should throw error if the template URL is empty', () => {
    class TestElement extends BaseElement { }

    expect(() => {
      CustomElement({tag: 'tag', templateUrl: ''})(TestElement);
    }).toThrowError(/non empty template URL/);
  });
});
