import {HttpOptions, HttpResponse} from 'vue-resource'
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {$, getToken, getVersion, getLanguage, isLogged, signOut, HttpStatus, error} from '@/simpli'
<%_ } else { _%>
import {$, getVersion, getLanguage, HttpStatus, error} from '@/simpli'
<%_ } _%>

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

<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
  if (isLogged()) request.headers.set('Authorization', `Bearer ${getToken()}`)

<%_ } _%>
  next((resp: HttpResponse) => {
    if (!resp.status) error('system.error.noServer')
    else if (resp.status >= 400) {
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
      if (resp.status === HttpStatus.UNAUTHORIZED) signOut()

<%_ } _%>
      $.snotify.error(resp.data.message || resp.statusText, resp.status.toString())
    }
  })
}
