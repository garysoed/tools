interface AnimationKeyframe {
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