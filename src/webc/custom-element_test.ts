import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';

import {BaseElement} from './base-element';
import {customElement} from './custom-element';
import {CustomElementUtil} from './custom-element-util';


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
    assert(CustomElementUtil.setConfig).to.haveBeenCalledWith(TestElement, config);
  });

  it('should throw exception if the constructor does not extend BaseElement', () => {
    class TestElement { }

    assert(() => {
      customElement({tag: 'tag', templateKey: 'templateKey'})(TestElement);
    }).to.throwError(/extend BaseElement/);
  });

  it('should throw error if the tag name is empty', () => {
    class TestElement extends BaseElement { }

    assert(() => {
      customElement({tag: '', templateKey: 'templateKey'})(TestElement);
    }).to.throwError(/non empty tag name/);
  });

  it('should throw error if the template URL is empty', () => {
    class TestElement extends BaseElement { }

    assert(() => {
      customElement({tag: 'tag', templateKey: ''})(TestElement);
    }).to.throwError(/non empty template key/);
  });
});
