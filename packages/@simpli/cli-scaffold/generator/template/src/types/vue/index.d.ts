import { Http } from 'vue-resource/types/vue_resource'
import { SnotifyService } from 'vue-snotify/SnotifyService'
import { AwaitController } from 'simpli-web-sdk/lib/components/utils/Await'
import { ModalController } from 'simpli-web-sdk/lib/components/utils/Modal'
import VueRouter, { Route } from 'vue-router'
import VueI18n, {IVueI18n} from 'vue-i18n'
import VueResource from 'vue-resource'
import HttpOptions = VueResource.HttpOptions
import HttpResponse = VueResource.HttpResponse
import $http = VueResource.$http
import $resource = VueResource.$resource
import { Store } from 'vuex'

declare module 'vue/types/vue' {
  interface Vue {
    // simpli-web-sdk
    $apiURL: string
    $bus: Vue
    $snotify: SnotifyService | any
    $await: AwaitController
    $modal: ModalController

    // vue-router
    $router: VueRouter
    $route: Route

    // vue-i18n
    readonly $i18n: VueI18n & IVueI18n
    $t: typeof VueI18n.prototype.t
    $tc: typeof VueI18n.prototype.tc
    $te: typeof VueI18n.prototype.te
    $d: typeof VueI18n.prototype.d
    $n: typeof VueI18n.prototype.n

    // vue-resource
    $http: {
      (options: HttpOptions): PromiseLike<HttpResponse>
      get: $http
      post: $http
      put: $http
      patch: $http
      delete: $http
      jsonp: $http
    }
    $resource: $resource

    // vuex
    $store: Store<any>
  }
  interface VueConstructor {
    http: Http
  }
}
