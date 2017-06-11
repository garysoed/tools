import { AttributeSelector, ElementSelector } from '../interfaces/selector';
import { AttributeChangeHandler } from '../webc/attribute-change-handler';
import { EventHandler } from '../webc/event-handler';

export const ATTRIBUTE_CHANGE_HANDLER = new AttributeChangeHandler();
export const EVENT_HANDLER = new EventHandler();

export const onDom = {
  attributeChange({name, parser, selector}: AttributeSelector<any>): MethodDecorator {
    return ATTRIBUTE_CHANGE_HANDLER.createDecorator(name, parser, selector);
  },

  event(selector: ElementSelector, event: string): MethodDecorator {
    return EVENT_HANDLER.createDecorator(event, selector, []);
  },
};
