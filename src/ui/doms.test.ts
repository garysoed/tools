import { assert, should } from '@gs-testing';

import { Doms } from './doms';


describe('ui.Doms', () => {
  let rootEl: HTMLElement;

  beforeEach(() => {
    rootEl = document.createElement('div');
    document.body.appendChild(rootEl);
  });

  afterEach(() => {
    rootEl.remove();
  });

  describe('getNextSiblings', () => {
    should(`return the siblings correctly`, () => {
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      const element3 = document.createElement('div');
      const element4 = document.createElement('div');
      const parentEl = document.createElement('div');
      parentEl.appendChild(element1);
      parentEl.appendChild(element2);
      parentEl.appendChild(element3);
      parentEl.appendChild(element4);

      assert(Doms.getNextSiblings(element2)()).to.startWith([element3, element4]);
    });
  });
});
