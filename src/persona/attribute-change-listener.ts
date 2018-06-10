import { DisposableFunction } from 'gs-tools/export/dispose';
import { Errors } from 'gs-tools/export/error';
import { Event } from 'gs-tools/export/event';
import { DomProvider } from './dom-provider';
import { Listener } from './listener';

// import { DisposableFunction } from '../dispose';
// import { Errors } from '../error';
// import { Event } from '../interfaces';
// import { AttributeSelectorImpl } from '../persona/attribute-selector';
// import { Listener } from '../persona/listener';
// import { AttributeSelector } from '../persona/selectors';

export class AttributeChangeListener<T> implements Listener<'change'> {
  constructor(
      private readonly attributeName_: string,
      private readonly elementProvider_: DomProvider) { }

  createMutationObserver_(callback: (records: Iterable<MutationRecord>) => void):
      MutationObserver {
    return new MutationObserver(callback);
  }

  onMutation_(
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
    const element = this.elementProvider_(root);
    if (!element) {
      throw Errors.assert(`element for [${elementSelector}]`).shouldExist().butWas(element);
    }
    observer.observe(
        element,
        {
          attributeFilter: [this.attributeName_],
          attributeOldValue: true,
          attributes: true,
        });
    return DisposableFunction.of(() => {
      observer.disconnect();
    });
  }

  toString(): string {
    return `AttributeChangeListener(${this.attributeSelector_})`;
  }
}

export function attributeChangeListener<T>(
    selector: AttributeSelector<T>): AttributeChangeListener<T> {
  if (!(selector instanceof AttributeSelectorImpl)) {
    throw Errors.assert('selector').shouldBeAnInstanceOf(AttributeSelectorImpl).butWas(selector);
  }

  return new AttributeChangeListener(selector);
}
