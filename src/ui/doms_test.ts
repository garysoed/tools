import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ImmutableList } from '../immutable/immutable-list';
import { Fakes } from '../mock/fakes';
import { Doms } from '../ui/doms';


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
      const element1 = document.createElement('a');
      const element2 = document.createElement('b');
      const element3 = document.createElement('div');

      const mockCallback = Fakes.build(jasmine.createSpy('Callback'))
          .when(element1).return(element2)
          .when(element2).return(element3)
          .when(element3).return(null)
          .else().return(null);

      assert(Doms.domIterable(element1, mockCallback)).to.startWith([
        element1,
        element2,
        element3,
      ]);
    });
  });

  describe('getShadowHost', () => {
    it('should return the shadow host', () => {
      const host = document.createElement('div');
      const fromEl = document.createElement('div');
      const shadowRoot = host['createShadowRoot']();
      shadowRoot.appendChild(fromEl);
      assert(Doms.getShadowHost(fromEl)).to.equal(host);
    });

    it('should return null if the parent node is not a shadow root', () => {
      const host = document.createElement('div');
      const fromEl = document.createElement('div');
      host.appendChild(fromEl);
      assert(Doms.getShadowHost(fromEl)).to.beNull();
    });
  });

  describe('offsetParentIterable', () => {
    it('should create the correct iterable', () => {
      const fromEl = document.createElement('div');
      const parentEl = document.createElement('div');
      parentEl.appendChild(fromEl);
      parentEl.style.position = 'relative';
      const ancestorEl = document.createElement('div');
      ancestorEl.appendChild(parentEl);
      ancestorEl.style.position = 'relative';

      rootEl.appendChild(ancestorEl);

      assert(Doms.offsetParentIterable(fromEl)).to.startWith([
        fromEl,
        parentEl,
        ancestorEl,
        document.body,
      ]);
    });
  });

  describe('parentIterable', () => {
    it('should create the correct iterable', () => {
      const fromEl = document.createElement('div');
      const parentEl = document.createElement('div');
      parentEl.appendChild(fromEl);
      const ancestorEl = document.createElement('div');
      ancestorEl.appendChild(parentEl);

      rootEl.appendChild(ancestorEl);

      assert(Doms.parentIterable(fromEl)).to.startWith([
        fromEl,
        parentEl,
        ancestorEl,
        rootEl,
        document.body,
        document.documentElement,
      ]);
    });

    it('should iterate through shadow root', () => {
      const host = document.createElement('div');
      const parentEl = document.createElement('div');
      const fromEl = document.createElement('div');
      const shadowRoot = host['createShadowRoot']();
      shadowRoot.appendChild(parentEl);
      parentEl.appendChild(fromEl);
      rootEl.appendChild(host);

      assert(Doms.parentIterable(fromEl, true)).to.startWith([
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
      const fromEl = document.createElement('div');
      const parentEl = document.createElement('div');
      parentEl.style.paddingTop = '40px';
      parentEl.appendChild(fromEl);
      const toEl = document.createElement('div');
      toEl.style.paddingTop = '20px';
      toEl.style.position = 'relative';
      toEl.appendChild(parentEl);

      rootEl.appendChild(toEl);

      assert(Doms.relativeOffsetTop(fromEl, toEl)).to.equal(60);
    });

    it('should throw error if the to element is statically positioned', () => {
      const fromEl = document.createElement('div');
      const parentEl = document.createElement('div');
      const toEl = document.createElement('div');
      toEl.appendChild(parentEl);

      rootEl.appendChild(toEl);

      assert(() => {
        Doms.relativeOffsetTop(fromEl, toEl);
      }).to.throwError(/offset ancestor/);
    });

    it('should throw error if the to element is not an ancestor of the from element', () => {
      const fromEl = document.createElement('div');
      const toEl = document.createElement('div');

      rootEl.appendChild(toEl);

      assert(() => {
        Doms.relativeOffsetTop(fromEl, toEl);
      }).to.throwError(/offset ancestor/);
    });
  });
});
