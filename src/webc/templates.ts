import {Jsons} from '../jsons';
import {Validate} from '../valid/validate';


/**
 * Registers templates.
 * 
 * Use this for making web components.
 */
export class Templates {
  private static templates_: Map<string, string> = new Map<string, string>();

  /**
   * Retrieves the registered template.
   * @param key The key of the registered template to retrieve.
   * @return The registered template, or null if there are none.
   */
  static getTemplate(key: string): string {
    return Templates.templates_.get(key);
  }

  /**
   * Registers the given template string to the given key.
   * @param key The key to register to.
   * @param templateStr The template string to register.
   */
  static register(key: string, templateStr: string): void {
    Validate.map(Templates.templates_)
        .toNot.containKey(key)
        .orThrows(`Key ${key} is already registered`)
        .assertValid();
    Templates.templates_.set(key, templateStr);
  }
}

Jsons.setValue(window, 'gs.Templates', Templates);
