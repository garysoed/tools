import { Annotations } from '../data/annotations';
import { BaseDisposable } from '../dispose/base-disposable';
import { MonadUtil } from '../event/monad-util';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { ElementSelector } from '../interfaces/selector';
import { DimensionObserver } from '../ui/dimension-observer';
import { Handler } from '../webc/handler';

type DimensionChangeConfig = {handlerKey: string | symbol, selector: ElementSelector};

export const DIMENSION_CHANGE_ANNOTATIONS: Annotations<DimensionChangeConfig> =
    Annotations.of<DimensionChangeConfig>(Symbol('dimensionChangeHandler'));

export class DimensionChangeHandler implements Handler<DimensionChangeConfig> {
  configure(
      targetEl: Element,
      instance: BaseDisposable,
      configs: ImmutableSet<DimensionChangeConfig>): void {
    const handlerKeys = configs.mapItem((config: DimensionChangeConfig) => {
      return config.handlerKey;
    });
    const observer =
        DimensionObserver.of(this.onDimensionChanged_.bind(this, instance, handlerKeys), this);
    observer.observe(targetEl);
  }

  createDecorator(selector: ElementSelector): MethodDecorator {
    return function(
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor): PropertyDescriptor {
      DIMENSION_CHANGE_ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          {
            handlerKey: propertyKey,
            selector,
          });
      return descriptor;
    };
  }

  getConfigs(instance: BaseDisposable):
      ImmutableMap<string | symbol, ImmutableSet<DimensionChangeConfig>> {
    return DIMENSION_CHANGE_ANNOTATIONS.forCtor(instance.constructor).getAttachedValues();
  }

  private onDimensionChanged_(
      this: DimensionChangeHandler,
      instance: BaseDisposable,
      handlerKeys: (string | symbol)[],
      clientRect: ClientRect): void {
    for (const handlerKey of handlerKeys) {
      MonadUtil.callFunction(
          {clientRect, type: 'gs-dimensionchange'},
          instance,
          handlerKey);
    }
  }
}
