interface FormData extends Array<any> {
  append(name: string, value: string, filename?: string): void;
  delete(name: string): void;
  set(name: string, value: string, filename?: string): void;
}

interface AnimationKeyframe {
  height?: string,
  opacity?: number
  width?: string
}

interface AnimationOption {
  duration?: number,
  easing?: string,
}

interface HTMLElement {
  animate(keyframes: AnimationKeyframe[], options_: AnimationOption): EventTarget;
  getDistributedNodes(): HTMLElement[];
  shadowRoot: HTMLElement;
}