import {SnotifyToastConfig} from 'vue-snotify'
import {$} from '@/facade'

export abstract class ToastHelper {
  static success(
    body: string,
    title?: string,
    useI18n = true,
    config: SnotifyToastConfig = {}
  ) {
    if (useI18n)
      $.snotify.success(
        $.t(body) as string,
        title ? ($.t(title) as string) : '',
        config
      )
    else $.snotify.success(body, title || '', config)
  }

  static error(
    body: string,
    title?: string,
    useI18n = true,
    config: SnotifyToastConfig = {}
  ) {
    if (useI18n)
      $.snotify.error(
        $.t(body) as string,
        title ? ($.t(title) as string) : '',
        config
      )
    else $.snotify.error(body, title || '', config)
  }

  static abort(
    body: string,
    title?: string,
    useI18n = true,
    config: SnotifyToastConfig = {}
  ) {
    this.error(body, title, useI18n, config)
    throw new Error(useI18n ? ($.t(body) as string) : body)
  }

  static warning(
    body: string,
    title?: string,
    useI18n = true,
    config: SnotifyToastConfig = {}
  ) {
    if (useI18n)
      $.snotify.warning(
        $.t(body) as string,
        title ? ($.t(title) as string) : '',
        config
      )
    else $.snotify.warning(body, title || '', config)
  }

  static info(
    body: string,
    title?: string,
    useI18n = true,
    config: SnotifyToastConfig = {}
  ) {
    if (useI18n)
      $.snotify.info(
        $.t(body) as string,
        title ? ($.t(title) as string) : '',
        config
      )
    else $.snotify.info(body, title || '', config)
  }
}
