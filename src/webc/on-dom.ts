import { Parser } from '../interfaces/parser';
import { AttributeChangeHandler } from '../webc/attribute-change-handler';
import { EventHandler } from '../webc/event-handler';

type Config = {selector: string | null};
type AttributeConfig = {name: string, parser: Parser<any>} & Config;
type EventConfig = {name: string} & Config;

export const ATTRIBUTE_CHANGE_HANDLER = new AttributeChangeHandler();
export const EVENT_HANDLER = new EventHandler();

export const onDom = {
  attributeChange({name, parser, selector}: AttributeConfig): MethodDecorator {
    return ATTRIBUTE_CHANGE_HANDLER.createDecorator(name, parser, selector);
  },

  event({name, selector}: EventConfig): MethodDecorator {
    return EVENT_HANDLER.createDecorator(name, selector, []);
  },
};
