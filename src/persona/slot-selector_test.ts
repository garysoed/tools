import { assert, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { SlotSelectorImpl } from '../persona/slot-selector';

describe('persona.SlotSelectorImpl', () => {
  const NAME = 'name';
  let mockParentSelector: any;
  let selector: SlotSelectorImpl;

  beforeEach(() => {
    mockParentSelector = jasmine.createSpyObj('ParentSelector', ['getSelector', 'getValue']);
    mockParentSelector.getSelector.and.returnValue('parentSelector');
    selector = new SlotSelectorImpl(
      mockParentSelector,
      NAME,
      {
        end: document.createComment(`commentEnd`),
        start: document.createComment(`comment`),
      });
  });

  describe('getValue', () => {
    it(`should return the start and end nodes`, () => {
      const root = Mocks.object('root');
      const endNode = document.createComment(`${NAME}End`);
      const startNode = document.createComment(NAME);
      const parentEl = document.createElement('div');
      parentEl.appendChild(startNode);
      parentEl.appendChild(endNode);
      mockParentSelector.getValue.and.returnValue(parentEl);

      assert(selector.getValue(root)).to.equal({end: endNode, start: startNode});
    });

    it(`should add the end node if it does not exist`, () => {
      const root = Mocks.object('root');
      const startNode = document.createComment(NAME);
      const parentEl = document.createElement('div');
      parentEl.appendChild(startNode);
      mockParentSelector.getValue.and.returnValue(parentEl);

      const value = selector.getValue(root);
      assert(value).to.equal({end: Matchers.any(Node), start: startNode});
      assert(startNode.nextSibling).to.equal(value.end);
      assert(value.end.nodeName).to.equal(`#comment`);
      assert(value.end.nodeValue).to.equal(`${NAME}End`);
    });

    it(`should add the end node if it is not a comment`, () => {
      const root = Mocks.object('root');
      const endNode = document.createTextNode(`${NAME}End`);
      const startNode = document.createComment(NAME);
      const parentEl = document.createElement('div');
      parentEl.appendChild(startNode);
      parentEl.appendChild(endNode);
      mockParentSelector.getValue.and.returnValue(parentEl);

      const value = selector.getValue(root);
      assert(value).to.equal({end: Matchers.any(Node), start: startNode});
      assert(startNode.nextSibling).to.equal(value.end);
      assert(value.end.nodeName).to.equal(`#comment`);
      assert(value.end.nodeValue).to.equal(`${NAME}End`);
    });

    it(`should add the end node if it has the wrong name`, () => {
      const root = Mocks.object('root');
      const endNode = document.createTextNode(`WrongName`);
      const startNode = document.createComment(NAME);
      const parentEl = document.createElement('div');
      parentEl.appendChild(startNode);
      parentEl.appendChild(endNode);
      mockParentSelector.getValue.and.returnValue(parentEl);

      const value = selector.getValue(root);
      assert(value).to.equal({end: Matchers.any(Node), start: startNode});
      assert(startNode.nextSibling).to.equal(value.end);
      assert(value.end.nodeName).to.equal(`#comment`);
      assert(value.end.nodeValue).to.equal(`${NAME}End`);
    });

    it(`should throw error if the start node does not exist`, () => {
      const root = Mocks.object('root');
      const parentEl = document.createElement('div');
      mockParentSelector.getValue.and.returnValue(parentEl);

      assert(() => {
        selector.getValue(root);
      }).to.throwError(/to exist/);
    });

    it(`should throw error if the start node is not a comment`, () => {
      const root = Mocks.object('root');
      const endNode = document.createComment(`${NAME}End`);
      const startNode = document.createTextNode(NAME);
      const parentEl = document.createElement('div');
      parentEl.appendChild(startNode);
      parentEl.appendChild(endNode);
      mockParentSelector.getValue.and.returnValue(parentEl);

      assert(() => {
        selector.getValue(root);
      }).to.throwError(/to exist/);
    });

    it(`should throw error if the start node has the wrong name`, () => {
      const root = Mocks.object('root');
      const endNode = document.createComment(`${NAME}End`);
      const startNode = document.createComment('wrong name');
      const parentEl = document.createElement('div');
      parentEl.appendChild(startNode);
      parentEl.appendChild(endNode);
      mockParentSelector.getValue.and.returnValue(parentEl);

      assert(() => {
        selector.getValue(root);
      }).to.throwError(/to exist/);
    });

    it(`should throw error if the parent element is null`, () => {
      const root = Mocks.object('root');
      mockParentSelector.getValue.and.returnValue(null);

      assert(() => {
        selector.getValue(root);
      }).to.throwError(/not null/);
    });
  });
});
