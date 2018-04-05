import {
  UriObject,
  FilterObject,
  LocaleObject,
} from '@/types/plugin'

/**
 * Extends interfaces in Vue.js
 */
declare module 'vue/types/vue' {
  interface Vue {
    $uri: UriObject
    $filter: FilterObject
    $locale: LocaleObject
  }
}
