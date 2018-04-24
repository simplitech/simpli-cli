import {ID, Currency, Lang} from '@/simpli'
<%_ var auth = rootOptions.scaffoldSetup.auth _%>
<%_ for (var i in auth.resolvedDependencies) { var dependence = auth.resolvedDependencies[i] _%>
<%-dependence.build()%>
<%_ } _%>
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
<%-rootOptions.scaffoldSetup.auth.buildType()-%>
  unauthenticatedPath?: string,
  eventListener: AuthEventListener,
}

export interface AuthEventListener {
  [key: string]: Array<(...params: any[]) => void>
}
