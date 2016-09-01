import {DisposableFunction} from '../dispose/disposable-function';
import {ListenableDom} from '../event/listenable-dom';


const __LISTENABLE: symbol = Symbol('listenable');

export const TestListenableDom = {
  afterEach(): void {},

  beforeEach(): void {
    spyOn(ListenableDom, 'of').and.callFake((element: any): any => {
      let mockListenable = jasmine.createSpyObj(
          `Listenable ${element}`,
          ['dispatch', 'dispose', 'on']);
      mockListenable.on.and.callFake(() => {
        return new DisposableFunction(() => undefined);
      });
      element[__LISTENABLE] = mockListenable;
      return mockListenable;
    });
  },

  getListenable(element: any): any {
    return element[__LISTENABLE];
  },
};
