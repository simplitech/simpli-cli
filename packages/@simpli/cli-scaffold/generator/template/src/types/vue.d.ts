import {Env} from '@/helpers/Env'
import {App} from '@/helpers/vuex/App'
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {Auth} from '@/helpers/vuex/Auth'
<%_ } _%>

declare module 'vue/types/vue' {
  interface Vue {
    $env: typeof Env

    $app: typeof App
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
    $auth: typeof Auth
<%_ } _%>
  }
}
