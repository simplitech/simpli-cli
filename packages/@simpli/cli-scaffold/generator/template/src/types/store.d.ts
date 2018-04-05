import User from '@/model/User'
import {ID} from '@/types/app'
import {CURRENCY, Lang} from '@/config/locale.config'
/**
 * Root
 */
export interface RootState {
  version: string
  language: Lang
  currency: CURRENCY
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
