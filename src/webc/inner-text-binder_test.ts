import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Parser } from '../interfaces';
import { FloatParser } from '../parse';
import { InnerTextBinder } from './inner-text-binder';


describe('webc.InnerTextBinder', () => {
  let element: HTMLElement;
  let parser: Parser<number>;
  let binder: InnerTextBinder<number>;

  beforeEach(() => {
    element = document.createElement('div');
    parser = FloatParser;
    binder = new InnerTextBinder(element, parser);
  });

  describe('delete', () => {
    it(`should set the inner text correctly`, () => {
      element.innerText = '123';
      binder.delete();
      assert(element.innerText).to.equal('');
    });
  });

  describe('get', () => {
    it(`should return the correct parsed value`, () => {
      element.innerText = '123';

      assert(binder.get()).to.equal(123);
    });
  });

  describe('set', () => {
    it(`should set the correct value`, () => {
      binder.set(123);
      assert(element.innerText).to.equal('123');
    });
  });
});
