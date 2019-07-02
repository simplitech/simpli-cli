/**
 * colors defined on .env
 */
export abstract class Color {
  static readonly PRIMARY: string = process.env.VUE_APP_PRIMARY_COLOR!
  static readonly SECONDARY: string = process.env.VUE_APP_SECONDARY_COLOR!
  static readonly TERTIARY: string = process.env.VUE_APP_TERTIARY_COLOR!
  static readonly SUCCESS: string = process.env.VUE_APP_SUCCESS_COLOR!
  static readonly DANGER: string = process.env.VUE_APP_DANGER_COLOR!
}
