/**
 * Environment variables defined in .env[.*]
 */
import {Lang, Currency} from 'simpli-web-sdk'

export abstract class Env {
  static readonly APP_ENV = process.env.VUE_APP_ENV!

  static readonly API_URL = process.env.VUE_APP_API_URL!
  static readonly SOCKET_URL = process.env.VUE_APP_SOCKET_URL!

  static readonly APP_NAME = process.env.VUE_APP_NAME!
  static readonly APP_LANG = process.env.VUE_APP_LANG! as Lang
  static readonly APP_CURRENCY = process.env.VUE_APP_CURRENCY! as Currency

  static readonly PRIMARY_COLOR = process.env.VUE_APP_PRIMARY_COLOR!
  static readonly SECONDARY_COLOR = process.env.VUE_APP_SECONDARY_COLOR!
  static readonly TERTIARY_COLOR = process.env.VUE_APP_TERTIARY_COLOR!
  static readonly SUCCESS_COLOR = process.env.VUE_APP_SUCCESS_COLOR!
  static readonly DANGER_COLOR = process.env.VUE_APP_DANGER_COLOR!

  static readonly SMALL_SCREEN = Number(process.env.VUE_APP_PRIMARY_COLOR!)
  static readonly MEDIUM_SCREEN = Number(process.env.VUE_APP_SECONDARY_COLOR!)
  static readonly LARGE_SCREEN = Number(process.env.VUE_APP_TERTIARY_COLOR!)
  static readonly EXTRA_LARGE_SCREEN = Number(process.env.VUE_APP_SUCCESS_COLOR!)
}
