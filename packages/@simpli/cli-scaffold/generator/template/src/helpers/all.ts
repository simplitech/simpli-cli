// custom
export * from './custom.helper'

// vuex
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
export * from './vuex/auth.helper'
<%_ } _%>
export * from './vuex/root.helper'
