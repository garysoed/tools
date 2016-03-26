const Checks = {
  isArrayOf<T>(obj: any, checkedType: new (...args: any[]) => T): obj is T[] {
    return Checks.isInstanceOf(obj, Array)
        && obj.every((member: any) => Checks.isInstanceOf(member, checkedType));
  },

  isInstanceOf<T>(obj: any, checkedType: new (...args: any[]) => T): obj is T {
    if (checkedType === (<any> String) && typeof obj === 'string') {
      return true;
    }
    if (checkedType === (<any> Boolean) && typeof obj === 'boolean') {
      return true;
    }
    return obj instanceof checkedType;
  },

  isRecordOf<T>(obj: any, checkedType: new (...args: any[]) => T): obj is {[key: string]: T} {
    if (!Checks.isInstanceOf(obj, Object)) {
      return false;
    }

    for (let key in obj) {
      if (!Checks.isInstanceOf(obj[key], checkedType)) {
        return false;
      }
    }

    return true;
  },
};

export default Checks;
