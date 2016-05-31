import {Arrays} from '../collection/arrays';
import BaseDisposable from '../dispose/base-disposable';
import {Checks} from '../checks';
import DisposableFunction from '../dispose/disposable-function';
import Doms from '../ui/doms';
import {Iterables} from '../collection/iterables';
import {Records} from '../collection/records';

/**
 * @hidden
 */
const CSS_ROOT_ATTR_ = 'gs-bem-root';

/**
 * Controller for the `gs-bem-class` directive.
 */
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
      classesToAdd = Records.of(newValue)
          .filterEntry((value: boolean) => value)
          .keys()
          .asArray();
    } else {
      throw Error(`Unhandled value ${newValue}`);
    }

    // Remove classes that are missing.
    Arrays
        .of(this.appliedClasses_)
        .removeAll(new Set<string>(classesToAdd))
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

  /**
   * Handler called during linking step.
   *
   * @param scope
   * @param attrValue Value of the `gs-bem-class` attribute.
   * @param element The element that the directive is attached to.
   */
  onLink(scope: angular.IScope, attrValue: string, element: HTMLElement): void {
    let rootEl = null;
    Iterables
        .of(Doms.parentIterable(element))
        .iterate((currentEl: HTMLElement, breakFn: () => void) => {
          if (!!currentEl.attributes.getNamedItem(CSS_ROOT_ATTR_)) {
            rootEl = currentEl;
            breakFn();
          }
        });

    if (!rootEl) {
      throw Error(`Cannot find ancestor element with attribute ${CSS_ROOT_ATTR_}`);
    }

    this.classPrefix_ = rootEl.attributes.getNamedItem(CSS_ROOT_ATTR_).value;
    this.element_ = element;

    this.addDisposable(new DisposableFunction(
        scope.$watch(attrValue, this.onWatchValueChange_.bind(this))));
  }
}

/**
 * Attribute directive to apply BEM to CSS classes.
 *
 * Using this consists of two parts:
 *
 * 1.  Use `gs-bem-class` instead of `ng-class` or `class` on the elements you want to apply this
 *     to.
 * 1.  At the root of your directive, add a `gs-bem-root` attribute.
 *
 * This directive will replace the CSS classes specified in `gs-bem-class` by prepending the value
 * in `gs-bem-root`.
 *
 * ```html
 * <div gs-bem-root="root-elem">
 *   <ul>
 *     <li gs-bem-class="list-item">
 *       This tag will have CSS class: root-elem__list-item
 *     </li>
 *   </ul>
 * </div>
 * ```
 *
 * The value of the attribute can take the following possible forms:
 *
 * 1.  **Simple string**: This string will simple be prepended with the `gs-bem-root` value.
 * 1.  **Array of strings**: All of the string elements in the array will be prepended with the
 *     `gs-bem-root` value.
 * 1.  **Record of booleans**: If the value of the entry is true, the key of that entry will be
 *     applied, with the `gs-bem-root` value prepended to the key.
 */
const NgModule = angular
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

export default NgModule;
