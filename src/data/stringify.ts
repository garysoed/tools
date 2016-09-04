import {Annotations} from './annotations';
import {Maps} from '../collection/maps';


export const __STRINGIFY: symbol = Symbol('stringify');

/**
 * Configuration for stringifying an object.
 */
type Config = {
  /**
   * Delimiter between properties of an object.
   */
  delimiter?: string,

  /**
   * True iff the produced string should be multiline.
   */
  multiline?: boolean,

  /**
   * Pad added to indent the string. Only used if multiline.
   */
  pad?: string,
};

export class Stringify {
  /**
   * Returns the string representation of the given object.
   *
   * @param instance The object whose string representation should be returned.
   * @param delimiter Delimiter inserted between fields for an object.
   * @[aram ]
   */
  private static toStringHelper_(
      instance: any,
      delimiter: string = ', ',
      multiline: boolean = true,
      pad: string = '  ',
      indent: string = ''): string {
    if (instance instanceof Function) {
      return indent + String(instance).match(/^function [^\(]*\([^\)]*\)/)![0];
    } else if (instance instanceof Object
        && Annotations.hasAnnotation(instance.constructor, __STRINGIFY)) {
      let annotations = Annotations.of(
          <new (...args: any[]) => any> instance.constructor,
          __STRINGIFY);
      let value = Maps
          .of(annotations.getFieldValues(instance))
          .entries()
          .map(([key, value]: [string | symbol, any]): string => {
            let stringifiedValue = Stringify.toStringHelper_(
                value,
                delimiter,
                multiline,
                pad,
                pad + indent);
            return `${key}: ${stringifiedValue}`;
          })
          .map((segment: string): string => {
            return multiline ? indent + pad + segment : segment;
          })
          .asArray()
          .join(multiline ? `${delimiter}\n` : delimiter);
      if (multiline) {
        return `${indent}{\n${value}\n${indent}}`;
      } else {
        return `{${value}}`;
      }
    } else {
      return indent + String(instance);
    }
  }

  /**
   * Indicates that a property should be included when stringified.
   */
  static Property(): PropertyDecorator {
    return (
        ctor: new (...args: any[]) => any,
        propertyKey: string | symbol): void => {
      Annotations.of(ctor, __STRINGIFY).addField(propertyKey);
    };
  }

  /**
   * Stringifies the given object.
   *
   * @param instance The object to stringify.
   * @param config Configuration object.
   */
  static toString(
      instance: Object,
      config: Config = {delimiter: ', ', multiline: true, pad: '  '}): string {
    return Stringify.toStringHelper_(
        instance,
        config.delimiter,
        config.multiline,
        config.pad);
  }
};
