import {Validator} from 'vee-validate'
import {Config} from '@/app/Config'
import {App} from '@/app/vuex/App'
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
import {Auth} from '@/app/vuex/Auth'
<%_ } _%>
import {EnvHelper} from '@/helpers/EnvHelper'
import {FileHelper} from '@/helpers/FileHelper'
import {XlsxHelper} from '@/helpers/XlsxHelper'
import {DialogHelper} from '@/helpers/DialogHelper'
import {FilterHelper} from '@/helpers/FilterHelper'
import {NavHelper} from '@/helpers/NavHelper'
import {ToastHelper} from '@/helpers/ToastHelper'
import {UtilsHelper} from '@/helpers/UtilsHelper'
import {SnotifyService} from 'vue-snotify/SnotifyService'
import {AwaitController} from '@simpli/vue-await/lib/Await'
import {ModalController} from '@simpli/vue-modal/lib/Modal'

declare module 'vue/types/vue' {
  interface Vue {
    // App
    $app: typeof App
<%_ if (rootOptions.scaffoldSetup.useAuth) { _%>
    $auth: typeof Auth
<%_ } _%>
    $config: typeof Config

    // Helper
    $env: typeof EnvHelper
    $file: typeof FileHelper
    $xlsx: typeof XlsxHelper
    $dialog: typeof DialogHelper
    $filter: typeof FilterHelper
    $nav: typeof NavHelper
    $toast: typeof ToastHelper
    $utils: typeof UtilsHelper

    $snotify: SnotifyService

    $await: AwaitController
    $modal: ModalController

    $validator: Validator
  }
}
