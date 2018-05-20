import { registerField_ } from './serializer';

/**
 * Annotates a property in a [[Serializable]] class and marks it to be exported when converted to
 * JSON object.
 *
 * @param name Name of the field. This name must be unique within the class and must not start with
 *    `_`.
 */
export function Field(name: string): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    registerField_(target, propertyKey);
  };
}
