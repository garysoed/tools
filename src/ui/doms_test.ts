import TestBase from '../test-base';
TestBase.setup();

import Doms from './doms';
import Iterables from '../collection/iterables';

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
          (fromEl: HTMLElement): HTMLElement => {
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

      expect(Iterables.of(Doms.domIterable(element1, mockCallback)).toArray().data).toEqual([
        element1,
        element2,
        element3,
      ]);
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

      expect(Iterables.of(Doms.offsetParentIterable(fromEl)).toArray().data).toEqual([
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

      expect(Iterables.of(Doms.parentIterable(fromEl)).toArray().data).toEqual([
        fromEl,
        parentEl,
        ancestorEl,
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

      expect(Doms.relativeOffsetTop(fromEl, toEl)).toEqual(60);
    });

    it('should throw error if the to element is statically positioned', () => {
      let fromEl = document.createElement('div');
      let parentEl = document.createElement('div');
      let toEl = document.createElement('div');
      toEl.appendChild(parentEl);

      rootEl.appendChild(toEl);

      expect(() => {
        Doms.relativeOffsetTop(fromEl, toEl);
      }).toThrowError(/offset ancestor/);
    });

    it('should throw error if the to element is not an ancestor of the from element', () => {
      let fromEl = document.createElement('div');
      let toEl = document.createElement('div');

      rootEl.appendChild(toEl);

      expect(() => {
        Doms.relativeOffsetTop(fromEl, toEl);
      }).toThrowError(/offset ancestor/);
    });
  });
});
