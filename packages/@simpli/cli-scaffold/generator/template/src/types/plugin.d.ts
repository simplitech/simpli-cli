import {Vue} from 'vue-property-decorator'

export interface UriObject { readonly [key: string]: any }
export interface FilterObject { readonly [key: string]: (val?: string, ...params: any[]) => string }
export interface LocaleObject { readonly [key: string]: any }
export interface ComponentObject { readonly [key: string]: typeof Vue }
