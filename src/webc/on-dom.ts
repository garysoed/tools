import { Parser } from '../interfaces/parser';
import { AttributeChangeHandler } from '../webc/attribute-change-handler';

type AttributeConfig = {name: string, parser: Parser<any>, selector: string | null};

export const ATTRIBUTE_CHANGE_HANDLER = new AttributeChangeHandler();

export const onDom = {
  attributeChange({name, parser, selector}: AttributeConfig): MethodDecorator {
    return ATTRIBUTE_CHANGE_HANDLER.createDecorator(name, parser, selector);
  },
};
