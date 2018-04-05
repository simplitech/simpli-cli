import {HttpOptions, HttpResponse} from 'vue-resource'
import {getToken, getVersion, getLanguage, isLogged, signOut, HttpStatus, error, snotify} from '@/helpers'

export const ApiURL: string = process.env.VUE_APP_API_URL || 'http:/localhost/api'

/*
 *** REGISTER HERE YOUR API Interceptor ***
 */
export const HttpConfigInterceptor: any = (request: HttpOptions, next: any): void => {
  request.headers.set('Accept-Language', getLanguage())
  request.headers.set('X-Client-Version', `w${getVersion()}`) // w = web

  if (isLogged()) request.headers.set('Authorization', `Bearer ${getToken()}`)

  next((resp: HttpResponse) => {
    if (!resp.status) error('system.error.noServer')
    else if (resp.status >= 400) {
      if (resp.status === HttpStatus.UNAUTHORIZED) signOut()

      snotify.error(resp.data.message || resp.statusText, resp.status.toString())
    }
  })
}
