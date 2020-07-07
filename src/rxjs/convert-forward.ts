import { Converter } from 'nabu';
import { EMPTY, of as observableOf, OperatorFunction, pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function convertForward<F, T>(
    converter: Converter<F, T>,
): OperatorFunction<F, T> {
  return pipe(
      switchMap(from => {
        const result = converter.convertForward(from);
        if (!result.success) {
          return EMPTY;
        }

        return observableOf(result.result);
      }),
  );
}
