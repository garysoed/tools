import TestBase from '../test-base';
TestBase.setup();

import Iterables from './iterables';


describe('collection.Iterables', () => {
  describe('forOf', () => {
    it('should call the function for every entry in the iterable', () => {
      let mockHandler = jasmine.createSpy('Handler');
      Iterables.of([1, 2, 3, 4]).forOf(mockHandler);

      expect(mockHandler).toHaveBeenCalledWith(1, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(2, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(3, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(4, jasmine.any(Function));
    });

    it('should stop the loop immediately after calling break', () => {
      let mockHandler = jasmine.createSpy('Handler').and
          .callFake((value: number, breakFn: () => void) => {
            if (value === 2) {
              breakFn();
            }
          });
      Iterables.of([1, 2, 3, 4]).forOf(mockHandler);

      expect(mockHandler).toHaveBeenCalledWith(1, jasmine.any(Function));
      expect(mockHandler).toHaveBeenCalledWith(2, jasmine.any(Function));
      expect(mockHandler).not.toHaveBeenCalledWith(3, jasmine.any(Function));
      expect(mockHandler).not.toHaveBeenCalledWith(4, jasmine.any(Function));
    });
  });
});
