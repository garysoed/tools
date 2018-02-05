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

interface Element {
  animate(keyframes: AnimationKeyframe[], options_: AnimationOption): EventTarget;
}

interface HTMLElement extends Element {
  getDistributedNodes(): HTMLElement[];
}

interface Node {
  getRootNode(options?: {composed?: boolean}): Node | null;
}