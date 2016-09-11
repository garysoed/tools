import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Arrays} from '../collection/arrays';
import {Doms} from './doms';

describe('ui.Doms', () => {
  let rootEl;

  beforeEach(() => {
    rootEl = document.createElement('div');
    document.body.appendChild(rootEl);
  });

  afterEach(() => {
    rootEl.remove();
  });

  describe('domsIterable', () => {
    it('should return the correct iterable', () => {
      let element1 = document.createElement('a');
      let element2 = document.createElement('b');
      let element3 = document.createElement('div');

      let mockCallback = jasmine.createSpy('Callback').and.callFake(
          (fromEl: HTMLElement): any => {
            switch (fromEl) {
              case element1:
                return element2;
              case element2:
                return element3;
              case element3:
                return null;
              default:
                return null;
            }
          });

      assert(Arrays.fromIterable(Doms.domIterable(element1, mockCallback)).asArray()).to.equal([
        element1,
        element2,
        element3,
      ]);
    });
  });

  describe('getShadowHost', () => {
    it('should return the shadow host', () => {
      let host = document.createElement('div');
      let fromEl = document.createElement('div');
      let shadowRoot = host['createShadowRoot']();
      shadowRoot.appendChild(fromEl);
      assert(Doms.getShadowHost(fromEl)).to.equal(host);
    });

    it('should return null if the parent node is not a shadow root', () => {
      let host = document.createElement('div');
      let fromEl = document.createElement('div');
      host.appendChild(fromEl);
      assert(Doms.getShadowHost(fromEl)).to.equal(null);
    });
  });

  describe('offsetParentIterable', () => {
    it('should create the correct iterable', () => {
      let fromEl = document.createElement('div');
      let parentEl = document.createElement('div');
      parentEl.appendChild(fromEl);
      parentEl.style.position = 'relative';
      let ancestorEl = document.createElement('div');
      ancestorEl.appendChild(parentEl);
      ancestorEl.style.position = 'relative';

      rootEl.appendChild(ancestorEl);

      assert(Arrays.fromIterable(Doms.offsetParentIterable(fromEl)).asArray()).to.equal([
        fromEl,
        parentEl,
        ancestorEl,
        document.body,
      ]);
    });
  });

  describe('parentIterable', () => {
    it('should create the correct iterable', () => {
      let fromEl = document.createElement('div');
      let parentEl = document.createElement('div');
      parentEl.appendChild(fromEl);
      let ancestorEl = document.createElement('div');
      ancestorEl.appendChild(parentEl);

      rootEl.appendChild(ancestorEl);

      assert(Arrays.fromIterable(Doms.parentIterable(fromEl)).asArray()).to.equal([
        fromEl,
        parentEl,
        ancestorEl,
        rootEl,
        document.body,
        document.documentElement,
      ]);
    });

    it('should iterate through shadow root', () => {
      let host = document.createElement('div');
      let parentEl = document.createElement('div');
      let fromEl = document.createElement('div');
      let shadowRoot = host['createShadowRoot']();
      shadowRoot.appendChild(parentEl);
      parentEl.appendChild(fromEl);
      rootEl.appendChild(host);

      assert(Arrays.fromIterable(Doms.parentIterable(fromEl, true)).asArray()).to.equal([
        fromEl,
        parentEl,
        host,
        rootEl,
        document.body,
        document.documentElement,
      ]);
    });
  });

  describe('relativeOffsetTop', () => {
    it('should return the relative top distance between the two given elements', () => {
      let fromEl = document.createElement('div');
      let parentEl = document.createElement('div');
      parentEl.style.paddingTop = '40px';
      parentEl.appendChild(fromEl);
      let toEl = document.createElement('div');
      toEl.style.paddingTop = '20px';
      toEl.style.position = 'relative';
      toEl.appendChild(parentEl);

      rootEl.appendChild(toEl);

      assert(Doms.relativeOffsetTop(fromEl, toEl)).to.equal(60);
    });

    it('should throw error if the to element is statically positioned', () => {
      let fromEl = document.createElement('div');
      let parentEl = document.createElement('div');
      let toEl = document.createElement('div');
      toEl.appendChild(parentEl);

      rootEl.appendChild(toEl);

      assert(() => {
        Doms.relativeOffsetTop(fromEl, toEl);
      }).to.throwError(/offset ancestor/);
    });

    it('should throw error if the to element is not an ancestor of the from element', () => {
      let fromEl = document.createElement('div');
      let toEl = document.createElement('div');

      rootEl.appendChild(toEl);

      assert(() => {
        Doms.relativeOffsetTop(fromEl, toEl);
      }).to.throwError(/offset ancestor/);
    });
  });
});
