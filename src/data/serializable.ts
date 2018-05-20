import { registerCtor_ } from './serializer';

/**
 * Provides a convenient way to serialize / deserialize objects to / from JSON.
 *
 * This uses three different parts:
 *
 * 1.  [[Serializable]]: This annotates the class to be serializable. You will need to give the
 *     class a unique ID for serialization.
 * 1.  [[Field]]: This annotates fields in the class as serializable. Like [[Serializable]], each
 *     field also needs an ID that uniquely identifies the field in the class. Note that the field
 *     has to be JSON serializable, or is annotated with [[Serializable]].
 * 1.  [[Serializer]]: This class actually does the conversion from / to JSON.
 *
 * Example class:
 *
 * ```typescript
 * // Ignore the \, there is something wrong with the doc parser.
 * \@Serializable('example')
 * class Example {
 *   @Field('fieldA') private fieldA_: number;
 *   @Field('fieldB') private fieldB_: string;
 *
 *   constructor(a?: number, b?: string) {
 *     this.fieldA_ = a;
 *     this.fieldB_ = b;
 *   }
 * }
 *
 * let example = new Example(1, 'b');
 * let json = Serializer.toJSON(example); // {_type: 'example', fieldA: 1, fieldB: 'b'}
 * Serializer.fromJSON(json); // This is the same as new Example(1, 'b');
 * ```
 *
 * Note that the class' constructor must be able to be called without any arguments.
 */

/**
 * Annotates a class and marks it as serializable.
 *
 * @param name Name of the class. This name should be unique within the binary.
 */
export function Serializable(name: string, parent: any = null): ClassDecorator {
  // TODO(gs): Check uniqueness.
  return <F extends Function>(ctor: F) => {
    registerCtor_(name, ctor);
  };
}
