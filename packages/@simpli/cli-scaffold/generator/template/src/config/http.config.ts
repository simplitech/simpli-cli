import {HttpOptions, HttpResponse} from 'vue-resource'
import {$, getToken, getVersion, getLanguage, isLogged, signOut, HttpStatus, error} from '@/simpli'

/*
 *** SET HERE THE API ENDPOINT ***
 */
export const apiURL = process.env.VUE_APP_API_URL

/*
 *** REGISTER HERE THE API INTERCEPTOR ***
 */
export const httpInterceptor = (request: HttpOptions, next: any) => {
  request.headers.set('Accept-Language', getLanguage())
  request.headers.set('X-Client-Version', `w${getVersion()}`) // w = web

  if (isLogged()) request.headers.set('Authorization', `Bearer ${getToken()}`)

  next((resp: HttpResponse) => {
    if (!resp.status) error('system.error.noServer')
    else if (resp.status >= 400) {
      if (resp.status === HttpStatus.UNAUTHORIZED) signOut()

      $.snotify.error(resp.data.message || resp.statusText, resp.status.toString())
    }
  })
}
