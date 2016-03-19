const __fields = Symbol('fields');
const __name = Symbol('name');

const TYPE_FIELD = '_type';
const CTORS = new Map<string, any>();

function initField(obj: Object): void {
  if (!obj[__fields]) {
    obj[__fields] = new Map<string | symbol, string>();
  }
}

export default class Serializer {
  static fromJSON(json: any): any {
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

  static toJSON(obj: any): any {
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

export function Serializable(name: string): ClassDecorator {
  // TODO(gs): Check uniqueness.
  return function<F extends Function>(ctor: F): void {
    CTORS.set(name, ctor);
    initField(ctor.prototype);
    ctor.prototype[__name] = name;
  };
};

export function Field(name: string): PropertyDecorator {
  // TODO(gs): Assert that the name does not start with _
  return function(target: Object, propertyKey: string | symbol): void {
    initField(target);
    target[__fields].set(propertyKey, name);
  };
}
