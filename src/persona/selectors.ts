import { ImmutableList } from '../immutable';
import { Selector } from '../persona/selector';

export interface AttributeSelector<T> extends Selector<T> {
  getElementSelector(): ElementSelector<any>;

  getName(): string;
}

export interface ChildrenSelector<T> extends Selector<ImmutableList<T>> { }

export interface ClassSelector extends Selector<boolean> { }

export interface DispatcherSelector<T> extends Selector<T> {
  getElementSelector(): ElementSelector<HTMLElement>;
}

export interface ElementSelector<T extends HTMLElement> extends Selector<T> {
  getSelector(): string;
}

export interface InnerTextSelector<T> extends Selector<T> {
  getElementSelector(): ElementSelector<HTMLElement>;
}

export interface SlotSelector extends Selector<{end: Node, start: Node}> {
  getCommentName(): string;

  getParentSelector(): ElementSelector<HTMLElement>;
}

export interface SwitchSelector<T> extends Selector<T> { }
