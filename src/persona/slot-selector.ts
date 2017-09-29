import { HasPropertiesType, InstanceofType } from '../check';
import { AssertionError } from '../error';
import { instanceId } from '../graph';
import { ImmutableList } from '../immutable';
import {
  ElementSelector,
  ElementSelectorImpl,
  ElementSelectorStub } from '../persona/element-selector';
import { Selector, SelectorImpl, SelectorStub } from '../persona/selector';

type SlotPair = {end: Node, start: Node};

export interface SlotSelector extends Selector<SlotPair> {
  getCommentName(): string;

  getParentSelector(): ElementSelector<HTMLElement>;
}

export class SlotSelectorStub extends SelectorStub<SlotPair> implements SlotSelector {
  constructor(
      private readonly parentSelector_: ElementSelectorStub<HTMLElement>,
      private readonly commentName_: string,
      private readonly defaultValue_: SlotPair) {
    super();
  }

  getCommentName(): string {
    return this.commentName_;
  }

  getParentSelector(): ElementSelector<HTMLElement> {
    return this.parentSelector_;
  }

  resolve(allSelectors: {}): SlotSelectorImpl {
    return new SlotSelectorImpl(
        this.parentSelector_.resolve(allSelectors),
        this.commentName_,
        this.defaultValue_);
  }
}

export class SlotSelectorImpl extends SelectorImpl<SlotPair> implements SlotSelector {
  constructor(
      private readonly parentSelector_: ElementSelectorImpl<HTMLElement>,
      private readonly commentName_: string,
      defaultValue: SlotPair) {
    super(
        defaultValue,
        instanceId(
            `${parentSelector_.getSelector()}@slot(${commentName_})`,
            HasPropertiesType({
              end: InstanceofType(Node),
              start: InstanceofType(Node),
            })));
  }

  getCommentName(): string {
    return this.commentName_;
  }

  getParentSelector(): ElementSelector<HTMLElement> {
    return this.parentSelector_;
  }

  getValue(root: ShadowRoot): SlotPair {
    const element = this.parentSelector_.getValue(root);
    if (!element) {
      throw AssertionError.condition('parent element', 'not null', element);
    }

    const childNodes = ImmutableList.of(element.childNodes);
    const startNode = childNodes.find((node: Node) => {
      return node.nodeName === '#comment' && node.nodeValue === this.commentName_;
    });

    if (!startNode) {
      throw AssertionError.generic(`Expected slot "${this.commentName_}" to exist`);
    }

    const endCommentName = `${this.commentName_}End`;
    const endNode = childNodes.find((node: Node) => {
      return node.nodeName === '#comment' && node.nodeValue === endCommentName;
    });

    if (endNode) {
      return {end: endNode, start: startNode};
    }

    return {
      end: element.insertBefore(
          element.ownerDocument.createComment(endCommentName),
          startNode.nextSibling),
      start: startNode,
    };
  }

  setValue_(): void {
    throw new Error('Unsupported');
  }
}

export function slotSelector(
    parentSelector: ElementSelector<HTMLElement>,
    slotName: string): SlotSelector {
  const commentName = `slot(${slotName})`;
  const defaultValue = {
    end: document.createComment(`${commentName}End`),
    start: document.createComment(`${commentName}`),
  };
  if (parentSelector instanceof ElementSelectorStub) {
    return new SlotSelectorStub(parentSelector, commentName, defaultValue);
  } else if (parentSelector instanceof ElementSelectorImpl) {
    return new SlotSelectorImpl(parentSelector, commentName, defaultValue);
  } else {
    throw new Error(`Unhandled ElementSelector type ${parentSelector}`);
  }
}
