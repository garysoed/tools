import { AttributeConfig } from '../interfaces/attribute-config';
import { EventConfig } from '../interfaces/event-config';
import { Parser } from '../interfaces/parser';
import { AttributeChangeHandler } from '../webc/attribute-change-handler';
import { EventHandler } from '../webc/event-handler';

export const ATTRIBUTE_CHANGE_HANDLER = new AttributeChangeHandler();
export const EVENT_HANDLER = new EventHandler();

export const onDom = {
  attributeChange({name, parser, selector}: AttributeConfig<any>): MethodDecorator {
    return ATTRIBUTE_CHANGE_HANDLER.createDecorator(name, parser, selector);
  },

  event({name, selector}: EventConfig): MethodDecorator {
    return EVENT_HANDLER.createDecorator(name, selector, []);
  },
};
