import { assert, should } from 'gs-testing/export/main';
import { createSpy, fake } from 'gs-testing/export/spy';
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

  describe('domsIterable', () => {
    should('return the correct iterable', () => {
      const element1 = document.createElement('a');
      const element2 = document.createElement('b');
      const element3 = document.createElement('div');

      const mockCallback = fake(createSpy<HTMLElement|null, [HTMLElement]>('Callback'))
          .when(element1).return(element2)
          .when(element2).return(element3)
          .when(element3).return(null)
          .always().return(null);

      assert(Doms.domIterable(element1, mockCallback)).to.startWith([
        element1,
        element2,
        element3,
      ]);
    });
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

      assert(Doms.getNextSiblings(element2)()).to.haveElements([element3, element4]);
    });
  });

  describe('offsetParentIterable', () => {
    should('create the correct iterable', () => {
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
    should('create the correct iterable', () => {
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
        // tslint:disable-next-line:no-non-null-assertion
        document.documentElement!,
      ]);
    });
  });

  describe('relativeOffsetTop', () => {
    should('return the relative top distance between the two given elements', () => {
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

    should('throw error if the to element is statically positioned', () => {
      const fromEl = document.createElement('div');
      const parentEl = document.createElement('div');
      const toEl = document.createElement('div');
      toEl.appendChild(parentEl);

      rootEl.appendChild(toEl);

      assert(() => {
        Doms.relativeOffsetTop(fromEl, toEl);
      }).to.throwErrorWithMessage(/offset ancestor/);
    });

    should('throw error if the to element is not an ancestor of the from element', () => {
      const fromEl = document.createElement('div');
      const toEl = document.createElement('div');

      rootEl.appendChild(toEl);

      assert(() => {
        Doms.relativeOffsetTop(fromEl, toEl);
      }).to.throwErrorWithMessage(/offset ancestor/);
    });
  });
});
