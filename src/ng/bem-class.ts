import Arrays from '../collection/arrays';
import BaseDisposable from '../dispose/base-disposable';
import Checks from '../checks';
import DisposableFunction from '../dispose/disposable-function';
import Doms from '../ui/doms';
import Iterables from '../collection/iterables';
import Records from '../collection/records';

const CSS_ROOT_ATTR = 'gs-bem-root';

export class BemClassCtrl extends BaseDisposable {
  private appliedClasses_: string[];
  private classPrefix_: string;
  private element_: HTMLElement;

  constructor() {
    super();
    this.appliedClasses_ = [];
    this.classPrefix_ = null;
    this.element_ = null;
  }

  private onWatchValueChange_(newValue: string|string[]|{[className: string]: boolean}): void {
    let classesToAdd: string[] = [];
    if (Checks.isInstanceOf(newValue, String)) {
      classesToAdd = [newValue];
    } else if (Checks.isArrayOf(newValue, String)) {
      classesToAdd = newValue;
    } else if (Checks.isRecordOf(newValue, Boolean)) {
      classesToAdd = Arrays
          .fromRecordKeys(
              Records.of(newValue)
                  .filter((value: boolean) => value)
                  .data)
          .data;
    } else {
      throw Error(`Unhandled value ${newValue}`);
    }

    // Remove classes that are missing.
    Arrays
        .of(this.appliedClasses_)
        .diff(classesToAdd)
        .forOf((classToRemove: string) => {
          this.element_.classList.remove(classToRemove);
        });

    // Add the new classes.
    this.appliedClasses_ = [];
    classesToAdd.forEach((classToAdd: string) => {
      let fullClassName = `${this.classPrefix_}__${classToAdd}`;
      this.element_.classList.add(fullClassName);
      this.appliedClasses_.push(fullClassName);
    });
  }

  onLink(scope: angular.IScope, attrValue: string, element: HTMLElement): void {
    let rootEl = null;
    Iterables
        .of(Doms.parentIterable(element))
        .forOf((currentEl: HTMLElement, breakFn: () => void) => {
          if (!!currentEl.attributes.getNamedItem(CSS_ROOT_ATTR)) {
            rootEl = currentEl;
            breakFn();
          }
        });

    if (!rootEl) {
      throw Error(`Cannot find ancestor element with attribute ${CSS_ROOT_ATTR}`);
    }

    this.classPrefix_ = rootEl.attributes.getNamedItem(CSS_ROOT_ATTR).value;
    this.element_ = element;

    this.addDisposable(new DisposableFunction(
        scope.$watch(attrValue, this.onWatchValueChange_.bind(this))));
  }
}

export default angular
    .module('gsTools.ng.BemClass', [])
    .directive('gsBemClass', () => {
      return {
        controller: BemClassCtrl,
        link: (
            scope: angular.IScope,
            element: angular.IAugmentedJQuery,
            attr: angular.IAttributes,
            ctrl: BemClassCtrl): void => {
          ctrl.onLink(scope, attr['gsBemClass'], element[0]);
        },
        restrict: 'A',
      };
    });
