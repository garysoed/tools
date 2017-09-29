import { Parser } from '../interfaces';
import { JsonParser } from '../parse/json-parser';

export class ObjectParserImpl<T extends {}> implements Parser<{[K in keyof T]: T[K]}> {
  constructor(private spec_: {[K in keyof T]: Parser<T[K]>}) { }

  parse(input: string | null): {[K in keyof T]: T[K]} | null {
    const json = JsonParser.parse(input);
    if (!json) {
      return null;
    }

    const output: {[K in keyof T]: T[K]} = {} as any;
    for (const key in this.spec_) {
      const stringValue = json[key];
      if (stringValue === undefined) {
        return null;
      }
      output[key] = this.spec_[key].parse(stringValue);
    }
    return output;
  }

  stringify(value: {[K in keyof T]: T[K]} | null): string {
    if (!value) {
      return '';
    }

    const json: {[K in keyof T]: string} = {} as any;
    for (const key in this.spec_) {
      const objectValue = value[key];
      if (objectValue === undefined) {
        return '';
      }
      json[key] = this.spec_[key].stringify(objectValue);
    }
    return JsonParser.stringify(json);
  }
}

export function ObjectParser<T extends {}>(spec: {[K in keyof T]: Parser<T[K]>}):
    ObjectParserImpl<T> {
  return new ObjectParserImpl<T>(spec);
}
