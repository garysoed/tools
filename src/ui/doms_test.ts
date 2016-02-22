import TestBase from '../test-base';
TestBase.setup();

import Doms from './doms';

describe('ui.Doms', () => {
  let rootEl;

  beforeEach(() => {
    rootEl = document.createElement('div');
    document.body.appendChild(rootEl);
  });

  afterEach(() => {
    rootEl.remove();
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
        Doms.relativeOffsetTop(fromEl, toEl)
      }).toThrowError(/offset ancestor/);
    });

    it('should throw error if the to element is not an ancestor of the from element', () => {
      let fromEl = document.createElement('div');
      let toEl = document.createElement('div');

      rootEl.appendChild(toEl);

      expect(() => {
        Doms.relativeOffsetTop(fromEl, toEl)
      }).toThrowError(/offset ancestor/);
    });
  });
});
