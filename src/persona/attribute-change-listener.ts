import { DisposableFunction } from '../dispose';
import { AssertionError } from '../error';
import { Event } from '../interfaces';
import { AttributeSelector, AttributeSelectorImpl } from '../persona/attribute-selector';
import { Listener } from '../persona/listener';

export class AttributeChangeListener<T> implements Listener<'change'> {
  constructor(private readonly attributeSelector_: AttributeSelectorImpl<T>) { }

  private createMutationObserver_(callback: (records: Iterable<MutationRecord>) => void):
      MutationObserver {
    return new MutationObserver(callback);
  }

  private onMutation_(
      handler: (event: Event<'change'>) => any,
      context: any,
      records: Iterable<MutationRecord>): void {
    for (const record of records) {
      const attributeName = record.attributeName;
      if (attributeName === null) {
        continue;
      }

      const target = record.target;
      if (!(target instanceof Element)) {
        continue;
      }

      if (target.getAttribute(attributeName) === record.oldValue) {
        continue;
      }

      handler.call(context, {oldValue: record.oldValue, type: 'change'});
    }
  }

  start(
      root: ShadowRoot,
      handler: (event: Event<'change'>) => any,
      context: any): DisposableFunction {
    const observer = this.createMutationObserver_((records: Iterable<MutationRecord>) => {
      this.onMutation_(handler, context, records);
    });
    const elementSelector = this.attributeSelector_.getElementSelector();
    const element = elementSelector.getValue(root);
    if (!element) {
      throw AssertionError.condition(`element for ${elementSelector}`, 'exist', element);
    }
    observer.observe(
        element,
        {
          attributeFilter: [this.attributeSelector_.getName()],
          attributeOldValue: true,
          attributes: true,
        });
    return DisposableFunction.of(() => {
      observer.disconnect();
    });
  }
}

export function attributeChangeListener<T>(
    selector: AttributeSelector<T>): AttributeChangeListener<T> {
  if (!(selector instanceof AttributeSelectorImpl)) {
    throw AssertionError.instanceOf('selector', AttributeSelectorImpl, selector);
  }

  return new AttributeChangeListener(selector);
}
