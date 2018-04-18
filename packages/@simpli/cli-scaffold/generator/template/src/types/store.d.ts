<%_ var userModel = rootOptions.scaffoldSetup.userModel _%>
import User from '@/model/resource/<%-userModel%>'
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
  user: User,
  unauthenticatedPath?: string,
  eventListener: AuthEventListener,
}

export interface AuthEventListener {
  [key: string]: Array<(...params: any[]) => void>
}
