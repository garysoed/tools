import {Converter, Result} from 'nabu';

export class ObjectConverter<T extends Record<string, unknown>> implements
    Converter<{[K in keyof T]: T[K]}, unknown> {
  constructor(private readonly spec_: {[spec in keyof T]: Converter<T[spec], unknown>}) { }

  convertBackward(input: unknown): Result<{[K in keyof T]: T[K]}> {
    if (!(input instanceof Object)) {
      return {success: false};
    }

    const output: {[K in keyof T]: T[K]} = {} as any;
    for (const key in this.spec_) {
      if (!this.spec_.hasOwnProperty(key)) {
        continue;
      }

      const inputValue = (input as any)[key] as unknown;
      if (inputValue === undefined) {
        return {success: false};
      }

      const conversionResult = this.spec_[key].convertBackward(inputValue);
      if (!conversionResult.success) {
        return {success: false};
      }

      output[key] = conversionResult.result;
    }

    return {result: output, success: true};
  }

  convertForward(value: {[K in keyof T]: T[K]}): Result<unknown> {
    const serializable: Record<keyof T, unknown> = {} as any;
    for (const key in this.spec_) {
      if (!this.spec_.hasOwnProperty(key)) {
        continue;
      }

      const objectValue = value[key];
      const conversionResult = this.spec_[key].convertForward(objectValue);
      if (!conversionResult.success) {
        return {success: false};
      }
      serializable[key] = conversionResult.result;
    }

    return {result: serializable, success: true};
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function objectConverter<T extends {}>(
    spec: {[K in keyof T]: Converter<T[K], unknown>},
): ObjectConverter<T> {
  return new ObjectConverter<T>(spec);
}
