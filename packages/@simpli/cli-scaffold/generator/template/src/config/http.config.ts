/**
 * @file
 * Http Request Configuration
 * Used in library: axios
 *
 * This file provides the standard configuration to communicate with the server
 * See https://github.com/axios/axios
 * This configuration will be set in @/bootstrap/app.ts
 */

import axios, {AxiosError} from 'axios'
import {$, Helper, Enum, socket} from '@/simpli'
import {AppHelper} from '@/helpers'

/**
 * Web Server request & response config
 */
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
})

/**
 * Socket Server config
 */
const socketInstance = socket.create({
  baseURL: process.env.VUE_APP_SOCKET_URL,
})

/**
 * Interceptor for every HTTP request of this app
 */
axiosInstance.interceptors.request.use((config) => {
  const pattern = /^(?:https?:)?\/\/[\w.]+[\w-/]+[\w?&=%]*$/g
  const isRelativeUrl = !pattern.exec(config.url || '')

  if (isRelativeUrl) {
    config.headers['Accept-Language'] = AppHelper.getLanguage()
    config.headers['X-Client-Version'] = `w${AppHelper.getVersion()}` // w = web
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>

    if (AppHelper.isLogged()) {
      config.headers.Authorization = `Bearer ${AppHelper.getToken()}`
    }
<%_ } _%>
  }

  return config
})

/**
 * Interceptor for every HTTP response of this app
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const response = error.response

    if (error.config.headers['X-Ignore-Errors']) {
      return Promise.reject('')
    }

    if (!response) {
      Helper.error('system.error.noServer')
      return Promise.reject($.t('system.error.noServer'))
    }

<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
    if (response.status === Enum.HttpStatus.UNAUTHORIZED) {
      AppHelper.signOut()
    }

<%_ } _%>
    if (response.status && response.status >= 400) {
      $.snotify.error(response.data.message || response.statusText, response.status.toString())
      return Promise.reject(response.data.message || response.statusText)
    }

    return Promise.reject(error)
  },
)

export {axiosInstance, socketInstance}
