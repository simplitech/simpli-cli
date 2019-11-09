import {Currency, Lang} from 'simpli-web-sdk'
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
<%_ var auth = rootOptions.scaffoldSetup.auth _%>
<%_ for (var i in auth.resolvedDependencies) { var dependence = auth.resolvedDependencies[i] _%>
<%-dependence.build()%>
<%_ } _%>
<%_ } _%>

/**
 * Root
 */
export interface RootState {
  version: string
  language: Lang
  currency: Currency
}
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>

/**
 * Auth Module
 */
export interface AuthState {
<%-rootOptions.scaffoldSetup.auth.buildType()-%>
  cachePath: string | null,
  eventListener: AuthEventListener,
}

export interface AuthEventListener {
  [key: string]: Array<(...param: any[]) => void>
}
<%_ } _%>
