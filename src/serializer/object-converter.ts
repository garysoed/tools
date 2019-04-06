import { Converter, Result, Serializable } from '@nabu/main';

export class ObjectConverter<T extends {}> implements
    Converter<{[K in keyof T]: T[K]}, Serializable> {
  constructor(private spec_: {[spec in keyof T]: Converter<T[spec], Serializable>}) { }

  convertBackward(input: Serializable): Result<{[K in keyof T]: T[K]}> {
    if (!(input instanceof Object)) {
      return {success: false};
    }

    const output: {[K in keyof T]: T[K]} = {} as any;
    for (const key in this.spec_) {
      if (!this.spec_.hasOwnProperty(key)) {
        continue;
      }

      const inputValue = (input as any)[key] as Serializable;
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

  convertForward(value: {[K in keyof T]: T[K]}): Result<Serializable> {
    const serializable: {[K in keyof T]: Serializable} = {} as any;
    for (const key in this.spec_) {
      if (!this.spec_.hasOwnProperty(key)) {
        continue;
      }

      const objectValue = value[key];
      if (objectValue === undefined) {
        return {success: false};
      }

      const conversionResult = this.spec_[key].convertForward(objectValue);
      if (!conversionResult.success) {
        return {success: false};
      }
      serializable[key] = conversionResult.result;
    }

    return {result: serializable, success: true};
  }
}

export function objectConverter<T extends {}>(
    spec: {[K in keyof T]: Converter<T[K], Serializable>},
): ObjectConverter<T> {
  return new ObjectConverter<T>(spec);
}
