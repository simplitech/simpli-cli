<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
<%_ var auth = rootOptions.scaffoldSetup.auth _%>
<%_ for (var i in auth.resolvedDependencies) { var dependence = auth.resolvedDependencies[i] _%>
<%-dependence.build()%>
<%_ } _%>
<%_ } _%>
import {Lang} from '@/enums/Lang'
import {Currency} from '@/enums/Currency'

/**
 * Root
 */
export interface RootState {
  version: string
  language: Lang | null
  currency: Currency | null
}
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>

/**
 * Auth Module
 */
export interface AuthState {
<%-rootOptions.scaffoldSetup.auth.buildType()-%>
  cachePath: string | null
}
<%_ } _%>
