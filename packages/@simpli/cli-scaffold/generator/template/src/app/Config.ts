import {HttpConfig} from '@/config/HttpConfig'
import {I18nConfig} from '@/config/I18nConfig'
import {RouterConfig} from '@/config/RouterConfig'
import {ToastConfig} from '@/config/ToastConfig'

export abstract class Config {
  static readonly http = new HttpConfig()
  static readonly i18n = new I18nConfig()
  static readonly router = new RouterConfig()
  static readonly toast = new ToastConfig()
}
