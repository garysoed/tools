import { ImmutableMap } from '../immutable/immutable-map';

const __FIELDS = Symbol('fields');
const __NAME = Symbol('name');
const __PARENT = Symbol('parent');
const CTORS = new Map<string, any>();
const TYPE_FIELD = '_type';

/**
 * Converts the given JSON object to a known [[Serializable]] object.
 *
 * @param json The JSON object to convert.
 * @return The known [[Serializable]] object converted from the JSON object.
 */
export function fromJSON(json: {[key: string]: any}): any {
  if (!json) {
    return json;
  }

  const ctor = CTORS.get(json[TYPE_FIELD]);
  if (!!ctor) {
    const defaultInstance = new ctor();

    for (const [key, jsonKey] of getFields_(ctor)) {
      const jsonValue = json[jsonKey];
      if (jsonValue !== undefined) {
        defaultInstance[key] = fromJSON(jsonValue);
      }
    }

    return defaultInstance;
  } else if (json instanceof Array) {
    return json.map(fromJSON);
  } else if (json instanceof Object) {
    const obj: any = {};
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        obj[key] = fromJSON((json as any)[key]);
      }
    }

    return obj;
  } else {
    return json;
  }
}

/**
 * Retrieves the fields for the given constructor.
 * @internal
 */
function getFields_(ctor: any): ImmutableMap<string, string> {
  const fields = (ctor.prototype[__PARENT]) ?
      getFields_(ctor.prototype[__PARENT]) :
      ImmutableMap.of<string, string>(new Map());

  return fields.addAll(ctor.prototype[__FIELDS]);
}

/**
 * @internal
 */
export function getRegisteredCtor_(serializedName: string): any {
  // tslint:disable-next-line:strict-boolean-expressions
  return CTORS.get(serializedName) || null;
}

/**
 * @internal
 */
export function getSerializedName_(ctor: any): string | null {
  // tslint:disable-next-line:strict-boolean-expressions
  return ctor[__NAME] || null;
}

/**
 * @internal
 */
function initField_(obj: Object): void {
  if (!(obj as any)[__FIELDS]) {
    (obj as any)[__FIELDS] = new Map<string | symbol, string>();
  }
}

/**
 * @internal
 */
export function registerCtor_(name: string, ctor: Function, parent: any = null): void {
  CTORS.set(name, ctor);
  initField_(ctor.prototype);
  ctor.prototype[__NAME] = name;

  if (parent !== null) {
    ctor.prototype[__PARENT] = parent;
  }
}

/**
 * @internal
 */
export function registerField_(target: Object, propertyKey: string | symbol): void {
  // TODO(gs): Assert that the name does not start with _
  initField_(target);
  (target as any)[__FIELDS].set(propertyKey, name);
}

/**
 * Converts the given [[Serializable]] object to JSON object.
 *
 * @param obj The [[Serializable]] object to convert.
 * @return The JSON object corresponding to the [[Serializable]] object.
 */
export function toJSON(obj: any): {[key: string]: any} {
  if (!(obj instanceof Object)) {
    return obj;
  }

  const ctor = obj.constructor;
  if (!!ctor.prototype[__NAME]) {
    const json: any = {[TYPE_FIELD]: ctor.prototype[__NAME]};
    for (const [key, jsonKey] of getFields_(ctor)) {
      json[jsonKey] = toJSON(obj[key]);
    }

    return json;
  } else if (obj instanceof Array) {
    return obj.map(toJSON);
  } else {
    const json: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        json[key] = toJSON(obj[key]);
      }
    }

    return json;
  }
}
