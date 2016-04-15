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
 */
const __fields = Symbol('fields');
const __name = Symbol('name');

const TYPE_FIELD = '_type';
const CTORS = new Map<string, any>();

function initField_(obj: Object): void {
  if (!obj[__fields]) {
    obj[__fields] = new Map<string | symbol, string>();
  }
}

/**
 * Manages conversion of serializable objects to / from JSON objects.
 */
class Serializer {

  /**
   * Converts the given JSON object to a known [[Serializable]] object.
   *
   * @param json The JSON object to convert.
   * @return The known [[Serializable]] object converted from the JSON object.
   */
  static fromJSON(json: gs.IJson): any {
    if (!json) {
      return json;
    }

    let ctor = CTORS.get(json[TYPE_FIELD]);
    if (!!ctor) {
      let defaultInstance = new ctor();

      ctor.prototype[__fields].forEach((jsonKey: string, key: string) => {
        let jsonValue = json[jsonKey];
        if (jsonValue !== undefined) {
          defaultInstance[key] = this.fromJSON(jsonValue);
        }
      });

      return defaultInstance;
    } else if (json instanceof Array) {
      return json.map((value: any) => this.fromJSON(value));
    } else if (json instanceof Object) {
      let obj = {};
      for (let key in json) {
        obj[key] = this.fromJSON(json[key]);
      }
      return obj;
    } else {
      return json;
    }
  }

  /**
   * Converts the given [[Serializable]] object to JSON object.
   *
   * @param obj The [[Serializable]] object to convert.
   * @return The JSON object corresponding to the [[Serializable]] object.
   */
  static toJSON(obj: any): gs.IJson {
    if (!(obj instanceof Object)) {
      return obj;
    }

    let ctor = obj.constructor;
    if (!!ctor.prototype[__name]) {
      let json = { [TYPE_FIELD]: ctor.prototype[__name] };
      ctor.prototype[__fields].forEach((jsonKey: string, key: string) => {
        json[jsonKey] = this.toJSON(obj[key]);
      });
      return json;
    } else if (obj instanceof Array) {
      return obj.map((value: any) => this.toJSON(value));
    } else {
      let json = {};
      for (let key in obj) {
        json[key] = this.toJSON(obj[key]);
      }
      return json;
    }
  }
};
export default Serializer;

/**
 * Annotates a class and marks it as serializable.
 *
 * @param name Name of the class. This name should be unique within the binary.
 */
export function Serializable(name: string): ClassDecorator {
  // TODO(gs): Check uniqueness.
  return function<F extends Function>(ctor: F): void {
    CTORS.set(name, ctor);
    initField_(ctor.prototype);
    ctor.prototype[__name] = name;
  };
};

/**
 * Annotates a property in a [[Serializable]] class and marks it to be exported when converted to
 * JSON object.
 *
 * @param name Name of the field. This name must be unique within the class and must not start with
 *    `_`.
 */
export function Field(name: string): PropertyDecorator {
  // TODO(gs): Assert that the name does not start with _
  return function(target: Object, propertyKey: string | symbol): void {
    initField_(target);
    target[__fields].set(propertyKey, name);
  };
}