import { Parser } from '../interfaces/parser';
import { Selector } from '../interfaces/selector';

export type AttributeConfig<T> = {name: string, parser: Parser<T>} & Selector;
