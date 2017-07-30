import { Annotations } from '../data/annotations';
import { Parser } from '../interfaces/parser';
import { Cases } from '../string/cases';

type EqualFn<T> = (item1: T, item2: T) => boolean;
export type Config = {
  eqFn: EqualFn<any>,
  fieldName: string,
  parser: Parser<any>,
  serializedFieldName: string,
};
export const ANNOTATIONS: Annotations<Config> = Annotations.of<Config>(Symbol('field'));

export function field<T>(
    fieldName: string,
    parser: Parser<T>,
    serializedFieldName: string = Cases.of(fieldName).toCamelCase(),
    eqFn: EqualFn<T> = (item1: T, item2: T) => item1 === item2):
    PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
        propertyKey,
        {
          eqFn,
          fieldName: Cases.of(fieldName).toPascalCase(),
          parser,
          serializedFieldName,
        });
  };
}