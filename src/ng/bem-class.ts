import Doms from '../ui/doms';
import Iterables from '../collection/iterables';

const CSS_ROOT_ATTR = 'gs-bem-root';

export class BemClassCtrl {
  constructor() { }

  onLink(attrValue: string, element: HTMLElement) {
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

    let classPrefix = rootEl.attributes.getNamedItem(CSS_ROOT_ATTR).value;
    attrValue.split(' ').forEach((className: string) => {
      element.classList.add(`${classPrefix}__${className}`);
    });
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
            ctrl: BemClassCtrl) => {
          ctrl.onLink(attr['gsBemClass'], element[0]);
        },
        restrict: 'A',
      };
    });
