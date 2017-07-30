interface AnimationKeyframe {
  bottom?: string
  height?: string
  left?: string
  opacity?: number
  right?: string
  top?: string
  width?: string
}

interface AnimationOption {
  duration?: number
  easing?: string
}

interface HTMLElement {
  animate(keyframes: AnimationKeyframe[], options_: AnimationOption): EventTarget;
  getDistributedNodes(): HTMLElement[];
}

interface Node {
  getRootNode(options?: {composed?: boolean}): Node | null;
}