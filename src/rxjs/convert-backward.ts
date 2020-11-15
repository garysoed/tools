import {Converter} from 'nabu';
import {EMPTY, OperatorFunction, of as observableOf, pipe} from 'rxjs';
import {switchMap} from 'rxjs/operators';

export function convertBackward<F, T>(
    converter: Converter<T, F>,
): OperatorFunction<F, T> {
  return pipe(
      switchMap(from => {
        const result = converter.convertBackward(from);
        if (!result.success) {
          return EMPTY;
        }

        return observableOf(result.result);
      }),
  );
}
