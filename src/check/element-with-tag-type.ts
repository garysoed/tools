import { Type } from '../check';

export function ElementWithTagType(tag: string): Type<HTMLElement> {
  return {
    check(target: any): target is HTMLElement {
      if (!(target instanceof HTMLElement)) {
        return false;
      }

      return target.tagName.toLowerCase() === tag.toLowerCase();
    },

    toString(): string {
      return `HTMLElement(${tag})`;
    },
  };
}
