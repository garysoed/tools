import {Arrays} from '../collection/arrays';
import {Maps} from '../collection/maps';
import {Natives} from '../typescript/natives';

import {Annotations} from './annotations';


export const ANNOTATIONS = Annotations.of(Symbol('stringify'));

/**
 * Configuration for stringifying an object.
 */
type Config = {
  /**
   * Delimiter between properties of an object.
   */
  delimiter?: string,

  /**
   * Pad added to indent the string. Only used if multiline.
   */
  pad?: string,
};

type Stringifiable = string | number | boolean | Date | Function | {[key: string]: any};

export class Stringify {

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
  private static formatField_(
      field: Stringifiable,
      delimiter: string = ',',
      pad: string = '  ',
      indent: string = ''): string {
    let lines: string[] = [];
    if (Natives.isString(field)) {
      lines.push(`"${field}"`);
    } else if (Natives.isNative(field)) {
      lines.push(String(field));
    } else if (field instanceof Date) {
      lines.push(field.toLocaleString());
    } else if (field instanceof Function) {
      return String(field).match(/^function [^\(]*\([^\)]*\)/)![0];
    } else {
      lines.push('{');
      let subArray = Maps
          .fromRecord(field)
          .entries()
          .map(([key, value]: [string, any]): string => {
            let stringifiedValue = Stringify.formatField_(
                value,
                delimiter,
                pad,
                pad + indent);
            return `${key}: ${stringifiedValue}`;
          })
          .map((line: string): string => {
            if (!!pad) {
              return (pad || '') + indent + line;
            } else {
              return line;
            }
          })
          .asArray();
      Arrays
          .of(subArray)
          .mapElement((line: string, index: number): string => {
            return (index < subArray.length - 1) ? line + delimiter : line;
          })
          .forEach((line: string): void => {
            lines.push(line);
          });
      if (!!pad) {
        lines.push(indent + '}');
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
  private static grabFields_(instance: any): Stringifiable {
    if (instance instanceof Object
        && ANNOTATIONS.hasAnnotation(instance.constructor)) {
      let record = {};
      Arrays
          .of(ANNOTATIONS.forCtor(instance.constructor).getAnnotatedProperties())
          .forEach((field: string | symbol): void => {
            let stringifiedField = Natives.isSymbol(field) ? `[${field.toString()}]` : field;
            let value = Stringify.grabFields_(instance[field]);
            record[stringifiedField] = value;
          });
      return record;
    } else {
      return instance;
    }
  }

  /**
   * Decorator to indicate that a property should be included when stringified.
   */
  static Property(): PropertyDecorator {
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
  static toString(
      instance: Object,
      config: Config = {delimiter: ',', pad: '  '}): string {
    return Stringify.formatField_(
        Stringify.grabFields_(instance),
        config.delimiter,
        config.pad);
  }
};
