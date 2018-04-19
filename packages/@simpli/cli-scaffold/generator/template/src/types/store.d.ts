<%_ var userModel = rootOptions.scaffoldSetup.userModel _%>
import {<%-userModel%>} from '@/model'
import {ID, Currency, Lang} from '@/simpli'
/**
 * Root
 */
export interface RootState {
  version: string
  language: Lang
  currency: Currency
}

/**
 * Auth Module
 */
export interface AuthState {
  id?: ID,
  token?: string,
  user: <%-userModel%>,
  unauthenticatedPath?: string,
  eventListener: AuthEventListener,
}

export interface AuthEventListener {
  [key: string]: Array<(...params: any[]) => void>
}
