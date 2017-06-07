import { Parser } from '../interfaces/parser';

export type AttributeSelector<T> = {name: string, parser: Parser<T>, selector: ElementSelector};

/**
 * Selector for an element relative to the element of the current custom element. 'parent' indicates
 * the parent element. 'null' indicates the current element.
 */
export type ElementSelector = string | null | 'parent';
export type Selector = ElementSelector | AttributeSelector<any>;
