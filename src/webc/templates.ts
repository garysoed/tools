import { Log } from '../util';

import { cache } from '../data';

const LOG = Log.of('gs-ui.webc.Templates');


/**
 * Registers templates.
 *
 * Use this for making web components.
 */
export class Templates {
  private static templates_: Map<string, string> = new Map<string, string>();

  constructor(private replacementMap_: Map<RegExp, string>) {  }

  /**
   * Retrieves the registered template.
   * @param key The key of the registered template to retrieve.
   * @return The registered template, or null if there are none.
   */
  @cache()
  getTemplate(key: string): string | null {
    if (!Templates.templates_.has(key)) {
      return null;
    }
    let result: string = Templates.templates_.get(key)!;
    for (const [regexp, replacement] of this.replacementMap_) {
      result = result.replace(regexp, replacement);
    }
    return result;
  }

  static newInstance(replacementMap: Map<RegExp, string> = new Map()): Templates {
    return new Templates(replacementMap);
  }

  /**
   * Registers the given template string to the given key.
   * @param key The key to register to.
   * @param templateStr The template string to register.
   */
  static register(key: string, templateStr: string): void {
    if (Templates.templates_.has(key)) {
      Log.warn(LOG, `Key ${key} is already registered`);
    }
    Templates.templates_.set(key, templateStr);
  }
}
// TODO: Mutable
