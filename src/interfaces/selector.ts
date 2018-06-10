import { DataBridge } from '../interfaces/data-bridge';
import { Parser } from '../parse/parser';

export interface AttributeSelector<T> {name: string; parser: Parser<T>; selector: ElementSelector; }
export interface ChildElementsSelector<T> {
  bridge: DataBridge<T>;
  endPadCount?: number;
  selector: ElementSelector;
  startPadCount?: number;
}

/**
 * Selector for an element relative to the element of the current custom element. 'parent' indicates
 * the parent element. 'null' indicates the current element. 'root' indicates the shadow root of the
 * current element.
 */
export type ElementSelector = string | null | 'parent';
export interface InnerTextSelector<T> {parser: Parser<T>; selector: ElementSelector; }
export type Selector = ElementSelector | AttributeSelector<any> | ChildElementsSelector<any>;
