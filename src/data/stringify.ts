import { NativeType, StringType, SymbolType } from 'gs-types/export';
import { Annotations } from '../data/annotations';
import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableMap } from '../immutable/immutable-map';


export const ANNOTATIONS = Annotations.of(Symbol('stringify'));

/**
 * Configuration for stringifying an object.
 */
interface Config {
  /**
   * Delimiter between properties of an object.
   */
  delimiter?: string;

  /**
   * Pad added to indent the string. Only used if multiline.
   */
  pad?: string;
}

type Stringifiable = string | number | boolean | Date | Function | {[key: string]: any};



/**
 * Converts the normalized fields to string.
 *
 * @param fields The normalized fields to be formatted.
 * @param delimiter String to use as delimiter.
 * @param pad The padding to be added. The string will be multi line iff this is not empty string.
 * @param indent The current indentation of the string for lines after the first.
 * @return The string representation of the fields. The first line will never have the
 *    indentation.
 */
function formatField_(
    field: Stringifiable,
    delimiter: string = ',',
    pad: string = '  ',
    indent: string = ''): string {
const lines: string[] = [];
if (StringType.check(field)) {
  lines.push(`"${field}"`);
} else if (NativeType.check(field)) {
  lines.push(String(field));
} else if (field instanceof Date) {
  lines.push(field.toLocaleString());
} else if (field instanceof Function) {
  return String(field).match(/^function [^\(]*\([^\)]*\)/)[0];
} else {
  lines.push('{');
  const entriesString = ImmutableMap
      .of(field)
      .entries()
      .mapItem(([key, value]: [string, any]): string => {
        const stringifiedValue = formatField_(
            value,
            delimiter,
            pad,
            pad + indent);

        return `${key}: ${stringifiedValue}`;
      })
      .mapItem((line: string): string => {
        if (pad) {
          return pad + indent + line;
        } else {
          return line;
        }
      });
  const delimitedLines = ImmutableList
      .of(entriesString)
      .map((line: string, index: number): string => {
        return (index < entriesString.size() - 1) ? line + delimiter : line;
      });
  for (const line of delimitedLines) {
    lines.push(line);
  }
  if (!!pad) {
    lines.push(`${indent}}`);
  } else {
    lines.push('}');
  }
}

return lines.join(!!pad ? '\n' : '');
}

/**
 * Collects the fields in to be stringified and normalize them.
 *
 * @param instance Instance whose fields should be collected and normalized.
 * @return JSON object containing the stringified and normalized fields.
 */
function grabFields_(instance: any): Stringifiable {
if (instance instanceof Object
    && ANNOTATIONS.hasAnnotation(instance.constructor)) {
  const record = {};
  for (const field of ANNOTATIONS.forCtor(instance.constructor).getAnnotatedProperties()) {
    const stringifiedField = SymbolType.check(field) ? `[${field.toString()}]` : field;
    const value = grabFields_(instance[field]);
    record[stringifiedField] = value;
  }

  return record;
} else {
  return instance;
}
}

/**
 * Decorator to indicate that a property should be included when stringified.
 */
export function Property(): PropertyDecorator {
return (
    proto: Object,
    propertyKey: string | symbol): void => {
  ANNOTATIONS.forCtor(proto.constructor).attachValueToProperty(propertyKey, {});
};
}

/**
 * Stringifies the given object.
 *
 * @param instance The object to stringify.
 * @param indent Number of spaces to be added.
 */
export function toString(
  instance: Object,
  config: Config = {delimiter: ',', pad: '  '}): string {
return formatField_(
    grabFields_(instance),
    config.delimiter,
    config.pad);
}
