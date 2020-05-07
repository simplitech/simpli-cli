import Vue from 'vue'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import VueMeta from 'vue-meta'
import VueMoment from 'vue-moment'
import VueSnotify from 'vue-snotify'
import VueSweetalert2 from 'vue-sweetalert2'
import VueTheMask from 'vue-the-mask'
import VueMoney from 'v-money'
import TransitionExpand from 'vue-transition-expand'
import VeeValidate from 'vee-validate'
import * as moment from 'moment'
import {merge} from 'lodash'

import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import GridLoader from 'vue-spinner/src/GridLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import RotateLoader from 'vue-spinner/src/RotateLoader.vue'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue'
import SquareLoader from 'vue-spinner/src/SquareLoader.vue'
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import SkewLoader from 'vue-spinner/src/SkewLoader.vue'
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import BounceLoader from 'vue-spinner/src/BounceLoader.vue'
import DotLoader from 'vue-spinner/src/DotLoader.vue'

import {$} from '@/facade'
import {Lang} from '@/enums/Lang'
import {Currency} from '@/enums/Currency'
import VueAdapTable from '@simpli/vue-adap-table'
import VueAwait from '@simpli/vue-await'
import VueModal from '@simpli/vue-modal'
import VueRenderSchema from '@simpli/vue-render-schema'
import {PageCollection} from '@simpli/resource-collection'
import {RequestConfig, RequestListener} from '@simpli/serialized-request'
import * as validators from '@brazilian-utils/brazilian-utils'

export abstract class Setup {
  static init() {
    Vue.config.productionTip = false

    Vue.prototype.$config = $.config
    Vue.prototype.$app = $.app
    Vue.prototype.$auth = $.auth
    Vue.prototype.$env = $.env
    Vue.prototype.$file = $.file
    Vue.prototype.$xlsx = $.xlsx
    Vue.prototype.$dialog = $.dialog
    Vue.prototype.$file = $.file
    Vue.prototype.$filter = $.filter
    Vue.prototype.$nav = $.nav
    Vue.prototype.$toast = $.toast
    Vue.prototype.$utils = $.utils

    Vue.use(VueAdapTable, {
      defaultBeforeQueryAction: () => $.await.init('softQuery'),
      defaultAfterQueryAction: () => $.await.done('softQuery'),
      defaultErrorQueryAction: () => $.await.error('softQuery'),
    })
    Vue.use(VueAwait)
    Vue.use(VueModal)
    Vue.use(VueRenderSchema)
    Vue.use(VueI18n)
    Vue.use(VueMeta)
    Vue.use(VueMoment)
    Vue.use(VueRouter)
    Vue.use(VueSnotify)
    Vue.use(VueSweetalert2)
    Vue.use(VueTheMask)
    Vue.use(TransitionExpand)
    Vue.use(VeeValidate, {
      i18n: new VueI18n($.config.i18n),
      useConstraintAttrs: false,
      dictionary: merge(
        $.config.i18n.messagesVeeValidate,
        $.config.i18n.messages
      ),
    })

    const filter: any = $.filter
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        Vue.filter(key, filter[key])
      }
    }

    moment.locale($.config.i18n.locale)

    RequestConfig.axios = $.config.http.axiosInstance
    RequestListener.onRequestStart(reqName => $.await.init(reqName))
    RequestListener.onRequestEnd(reqName => $.await.done(reqName))
    RequestListener.onRequestError(reqName => $.await.error(reqName))

    PageCollection.defaultMinCharToSearch = 3
    PageCollection.defaultCurrentPage = 0
    PageCollection.defaultPerPage = 10

    VeeValidate.Validator.extend('cpf', {
      validate: (value?: string) => validators.isValidCPF(value ?? ''),
    })
    VeeValidate.Validator.extend('cnpj', {
      validate: (value?: string) => validators.isValidCNPJ(value ?? ''),
    })
    VeeValidate.Validator.extend('phone', {
      validate: (value?: string) => validators.isValidPhone(value ?? ''),
    })
    VeeValidate.Validator.extend('cep', {
      validate: (value?: string) => validators.isValidCEP(value ?? ''),
    })
    VeeValidate.Validator.extend('boleto', {
      validate: (value?: string) => validators.isValidBoleto(value ?? ''),
    })

    $.await.addLoader('PulseLoader', PulseLoader)
    $.await.addLoader('GridLoader', GridLoader)
    $.await.addLoader('ClipLoader', ClipLoader)
    $.await.addLoader('RiseLoader', RiseLoader)
    $.await.addLoader('BeatLoader', BeatLoader)
    $.await.addLoader('SyncLoader', SyncLoader)
    $.await.addLoader('RotateLoader', RotateLoader)
    $.await.addLoader('FadeLoader', FadeLoader)
    $.await.addLoader('PacmanLoader', PacmanLoader)
    $.await.addLoader('SquareLoader', SquareLoader)
    $.await.addLoader('ScaleLoader', ScaleLoader)
    $.await.addLoader('SkewLoader', SkewLoader)
    $.await.addLoader('MoonLoader', MoonLoader)
    $.await.addLoader('RingLoader', RingLoader)
    $.await.addLoader('BounceLoader', BounceLoader)
    $.await.addLoader('DotLoader', DotLoader)

    $.await.defaultTransition = 'fade'
    $.await.defaultSpinner = 'ScaleLoader'
    $.await.defaultSpinnerColor = $.env.PRIMARY_COLOR
    $.await.defaultSpinnerPadding = '0'
    $.await.defaultSpinnerScale = 1

    $.modal.defaultBody = document.body
    $.modal.defaultTransition = 'blur'
    $.modal.defaultBackgroundTransition = 'fade'
    $.modal.defaultClosable = true
    $.modal.defaultCloseOutside = true

    $.snotify.setDefaults({
      global: $.config.toast.global,
      toast: $.config.toast.default,
    })

    $.app.language = $.config.i18n.locale
    $.app.currency = $.config.i18n.currency

    $.vm.$mount('#app')

    // @ts-ignore
    window.appLoader?.finish()
  }

  static changeLocale(lang: Lang) {
    $.vm.$i18n.locale = lang
  }

  static changeCurrency(currency: Currency) {
    Vue.use(VueMoney, {
      decimal: $.t('lang.decimal') as string,
      thousands: $.t('lang.thousands') as string,
      prefix: $.t(`currency.${currency}.prefix`) as string,
      precision: Number($.t(`currency.${currency}.precision`) as string),
    })
  }
}
