import { InstanceofType } from '../check';
import { instanceId } from '../graph';
import { ElementSelectorImpl } from '../persona/element-selector';

class ShadowHostSelectorImpl extends ElementSelectorImpl<HTMLElement> {
  constructor() {
    const selector = ':host';
    const type = InstanceofType(HTMLElement);
    super(':host()', type, instanceId(selector, type));
  }

  getValue(root: ShadowRoot): HTMLElement {
    const host = root.host;
    if (!this.type_.check(host)) {
      throw new Error(`Shadow root host has the wrong type. Expected HTMLElement but was ${host}`);
    }

    return host;
  }
}

export const shadowHostSelector = new ShadowHostSelectorImpl();
