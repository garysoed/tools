import {TestBase} from '../test-base';
TestBase.setup();

import {BaseElement} from './base-element';
import {customElement} from './custom-element';
import {CustomElementUtil} from './custom-element-util';
import {Mocks} from '../mock/mocks';


describe('webc.customElement', () => {
  let mockXtag;

  beforeEach(() => {
    mockXtag = Mocks.object('Xtag');
    window['xtag'] = mockXtag;
  });

  it('should bind the constructor correctly', () => {
    class TestElement extends BaseElement { }

    let config = {tag: 'tag', templateKey: 'templateKey'};
    spyOn(CustomElementUtil, 'setConfig');

    customElement(config)(TestElement);
    expect(CustomElementUtil.setConfig).toHaveBeenCalledWith(TestElement, config);
  });

  it('should throw exception if the constructor does not extend BaseElement', () => {
    class TestElement { }

    expect(() => {
      customElement({tag: 'tag', templateKey: 'templateKey'})(TestElement);
    }).toThrowError(/extend BaseElement/);
  });

  it('should throw error if the tag name is empty', () => {
    class TestElement extends BaseElement { }

    expect(() => {
      customElement({tag: '', templateKey: 'templateKey'})(TestElement);
    }).toThrowError(/non empty tag name/);
  });

  it('should throw error if the template URL is empty', () => {
    class TestElement extends BaseElement { }

    expect(() => {
      customElement({tag: 'tag', templateKey: ''})(TestElement);
    }).toThrowError(/non empty template key/);
  });
});
