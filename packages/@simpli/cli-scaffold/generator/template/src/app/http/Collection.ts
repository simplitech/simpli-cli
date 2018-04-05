import * as _ from 'lodash'
import {Type} from 'class-transformer'
import {Resource} from '@/app/http/Resource'
import {apiURL} from '@/helpers/http.helper'
import {Resp} from '@/types/app'
import {resource, t} from '@/helpers/prototypes.helper'
import {unparse} from 'papaparse'
import {ICollection, Scheme} from '@/types/app'
import {createCsvFile} from '@/helpers/misc.helper'
import HttpBody from '@/app/http/HttpBody'
import {HttpResponse} from 'vue-resource'
import {call} from '@/helpers/http.helper'

export default class Collection<T extends Resource> extends HttpBody implements ICollection<T> {
  /**
   * Items of the collection
   * @type {Array}
   */
  @Type((options) => (options!.newObject as Collection<T>).type)
  items: T[] = []

  /**
   * Collection Class of list
   */
  readonly type: any

  /**
   * Collection ClassObject of list
   */
  get resource() {
    return new this.type() as T
  }

  // Set T as type
  constructor(type: any) {
    super()
    this.type = type
  }

  /**
   * Serializes the response body of a call to the WebServer
   * @param promise Any call of VUE RESOURCE
   * @returns {PromiseLike<Resp<this>>}
   */
  async call(promise: PromiseLike<HttpResponse>) {
    const resp = await call(this.type, promise)
    this.items = resp.data
    return resp
  }

  /**
   * Lists resource from WebServer
   * @param params
   * @returns {Promise<Resp<this>>}
   */
  async query(params?: any) {
    return await this.call(resource(apiURL(this.resource.$endpoint)).query(params))
  }

  /**
   * Return headers with translate
   * @returns Array
   */
  get headers() {
    return _.mapValues(this.resource.scheme(), (val: any, key: string) =>
      t(`classes.${this.resource.$name}.columns.${key}`) as string)
  }

  /**
   * Returns a matrix of rows and columns
   * @returns Array
   */
  get rows() {
    return this.items.map((item: T) => item.scheme())
      .map((scheme: Scheme) => _.values(scheme))
  }

  /**
   * Returns the values of a given row
   * @param i
   * @returns Array
   */
  values(i: number) {
    return this.items[i].scheme()
  }

  /**
   * Downloads CSV file from its collection
   */
  downloadCsv() {
    if (this.items.length <= 0) return
    const title = t(`classes.${this.resource.$name}.title`) as string
    const data: Scheme[] = this.items
      .map((item: T) => item.csvScheme())
      .map((scheme: Scheme) =>
        _.mapKeys(scheme, (val: any, key: string) => t(`classes.${this.resource.$name}.columns.${key}`) as string))
    createCsvFile(title, unparse(data))
  }
}

