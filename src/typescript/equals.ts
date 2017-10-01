export function equals(item1: any, item2: any): boolean {
  if (item1 === item2) {
    return true;
  }

  if (item1 instanceof Function && item2 instanceof Function) {
    return item1 === item2;
  } else if (item1 instanceof Object && item2 instanceof Object) {
    if (!(item1 instanceof item2.constructor) ||
        !(item2 instanceof item1.constructor)) {
      return false;
    }

    for (const key in item1) {
      if (!equals(item1[key], item2[key])) {
        return false;
      }
    }

    return true;
  } else {
    return item1 === item2;
  }
}
