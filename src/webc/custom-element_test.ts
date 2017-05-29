import { assert, TestBase } from '../test-base';
TestBase.setup();

import { BaseDisposable } from '../dispose/base-disposable';
import { Mocks } from '../mock/mocks';
import { customElement } from '../webc/custom-element';
import { Util } from '../webc/util';


describe('webc.customElement', () => {
  let mockXtag;

  beforeEach(() => {
    mockXtag = Mocks.object('Xtag');
    window['xtag'] = mockXtag;
  });

  it('should bind the constructor correctly', () => {
    class TestElement extends BaseDisposable { }

    const config = {tag: 'tag', templateKey: 'templateKey'};
    spyOn(Util, 'setConfig');

    customElement(config)(TestElement);
    assert(Util.setConfig).to.haveBeenCalledWith(TestElement, config);
  });

  it('should throw exception if the constructor does not extend BaseDisposable', () => {
    class TestElement { }

    assert(() => {
      customElement({tag: 'tag', templateKey: 'templateKey'})(TestElement);
    }).to.throwError(/extend BaseDisposable/);
  });

  it('should throw error if the tag name is empty', () => {
    class TestElement extends BaseDisposable { }

    assert(() => {
      customElement({tag: '', templateKey: 'templateKey'})(TestElement);
    }).to.throwError(/non empty tag name/);
  });

  it('should throw error if the template URL is empty', () => {
    class TestElement extends BaseDisposable { }

    assert(() => {
      customElement({tag: 'tag', templateKey: ''})(TestElement);
    }).to.throwError(/non empty template key/);
  });
});
