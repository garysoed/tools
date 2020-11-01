import {Observable, of as observableOf} from 'rxjs';
import { Runnable } from './runnable';
import { assert, createSpy, run, should, test } from 'gs-testing';
import {tap} from 'rxjs/operators';

class TestClass extends Runnable {
  constructor(private readonly handler: (value: number) => void) {
    super();
    this.addSetup(this.setup([1, 2, 3]));
    this.addSetup(this.setup([4, 5]));
    this.addSetup(this.setup([6, 7, 8]));
  }

  private setup(values: readonly number[]): Observable<unknown> {
    return observableOf(...values).pipe(
        tap(value => this.handler(value)),
    );
  }
}

test('@tools/rxjs/runnable', () => {
  test('run', () => {
    should('call the handler with all emissions', () => {
      const mockHandler = createSpy<void, [number]>('Handler');
      const obj = new TestClass(mockHandler);
      run(obj.run());

      assert(mockHandler).to.haveBeenCalledWith(1);
      assert(mockHandler).to.haveBeenCalledWith(2);
      assert(mockHandler).to.haveBeenCalledWith(3);
      assert(mockHandler).to.haveBeenCalledWith(4);
      assert(mockHandler).to.haveBeenCalledWith(5);
      assert(mockHandler).to.haveBeenCalledWith(6);
      assert(mockHandler).to.haveBeenCalledWith(7);
      assert(mockHandler).to.haveBeenCalledWith(8);
    });
  });
});
