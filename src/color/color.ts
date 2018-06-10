export interface Color {
  /**
   * Blue component of the color.
   */
  getBlue(): number;

  /**
   * The chroma of the color.
   */
  getChroma(): number;

  /**
   * Green component of the color.
   */
  getGreen(): number;

  /**
   * Hue component of the color.
   */
  getHue(): number;

  /**
   * Lightness component of the color.
   */
  getLightness(): number;

  /**
   * Luminance of the color.
   */
  getLuminance(): number;

  /**
   * Red component of the color.
   */
  getRed(): number;

  /**
   * Saturation component of the color.
   */
  getSaturation(): number;
}
