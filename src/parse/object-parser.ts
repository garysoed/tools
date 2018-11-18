import { JsonParser } from '../parse/json-parser';
import { Parser } from './parser';

export class ObjectParserImpl<T extends {}> implements Parser<{[K in keyof T]: T[K]}> {
  constructor(private spec_: {[K in keyof T]: Parser<T[K]>}) { }

  convertBackward(input: string | null): {[K in keyof T]: T[K]}|null {
    const json = JsonParser<{[K in keyof T]: string}>().convertBackward(input);
    if (!json) {
      return null;
    }

    const output: {[K in keyof T]: T[K]} = {} as any;
    for (const key in this.spec_) {
      if (!this.spec_.hasOwnProperty(key)) {
        continue;
      }

      const stringValue = json[key];
      if (stringValue === undefined) {
        return null;
      }

      const value = this.spec_[key].convertBackward(stringValue);
      if (!value) {
        return null;
      }
      output[key] = value;
    }

    return output;
  }

  convertForward(value: {[K in keyof T]: T[K]} | null): string|null {
    if (!value) {
      return '';
    }

    const json: {[K in keyof T]: string} = {} as any;
    for (const key in this.spec_) {
      if (!this.spec_.hasOwnProperty(key)) {
        continue;
      }

      const objectValue = value[key];
      if (objectValue === undefined) {
        return '';
      }

      const result = this.spec_[key].convertForward(objectValue);
      if (result) {
        json[key] = result;
      }
    }

    return JsonParser().convertForward(json);
  }
}

export function ObjectParser<T extends {}>(spec: {[K in keyof T]: Parser<T[K]>}):
    ObjectParserImpl<T> {
  return new ObjectParserImpl<T>(spec);
}
