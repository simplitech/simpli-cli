import {SnotifyToastConfig} from 'vue-snotify'
import {snotify, t} from '@/helpers/prototypes.helper'
import {push} from '@/helpers/router.helper'

// Success Toast
export const success = (body: string, title?: string, useI18n: boolean = true, config?: SnotifyToastConfig) => {
  if (useI18n) snotify.success(t(body), title ? t(title) : undefined, config)
  else snotify.success(body, title || undefined, config)
}
export const successAndPush = (body: string,
                               uri: string,
                               title?: string,
                               useI18n: boolean = true,
                               config?: SnotifyToastConfig) => {
  success(body, title, useI18n, config)
  push(uri)
}

// Error Toast
export const error = (body: string, title?: string, useI18n: boolean = true, config?: SnotifyToastConfig) => {
  if (useI18n) snotify.error(t(body), title ? t(title) : undefined, config)
  else snotify.error(body, title || undefined, config)
}
export const errorValidation = (message: string) => error(message, t('system.error.validation') as string, false)
export const errorAndPush = (body: string,
                             uri: string,
                             title?: string,
                             useI18n: boolean = true,
                             config?: SnotifyToastConfig) => {
  error(body, title, useI18n, config)
  push(uri)
}

// Warning Toast
export const warning = (body: string, title?: string, useI18n: boolean = true, config?: SnotifyToastConfig) => {
  if (useI18n) snotify.warning(t(body), title ? t(title) : undefined, config)
  else snotify.warning(body, title || undefined, config)
}
export const warningAndPush = (body: string,
                               uri: string,
                               title?: string,
                               useI18n: boolean = true,
                               config?: SnotifyToastConfig) => {
  warning(body, title, useI18n, config)
  push(uri)
}

// Info Toast
export const info = (body: string, title?: string, useI18n: boolean = true, config?: SnotifyToastConfig) => {
  if (useI18n) snotify.info(t(body), title ? t(title) : undefined, config)
  else snotify.info(body, title || undefined, config)
}
export const infoAndPush = (body: string,
                            uri: string,
                            title?: string,
                            useI18n: boolean = true,
                            config?: SnotifyToastConfig) => {
  info(body, title, useI18n, config)
  push(uri)
}
