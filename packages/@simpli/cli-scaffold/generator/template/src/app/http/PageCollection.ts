import Collection from '@/app/http/Collection'
import {Resource} from '@/app/http/Resource'
import Query from '@/app/params/Query'
import {call} from '@/helpers/http.helper'
import {IPageCollection} from '@/types/app'
import {HttpResponse} from 'vue-resource'
import * as _ from 'lodash'

export default class PageCollection<T extends Resource> extends Collection<T> implements IPageCollection {
  total: number = 0
  querySearch: string = ''
  currentPage?: number = 0
  perPage?: number = 20
  orderBy?: string
  asc: boolean = true
  debounce: Function = _.debounce(this.searchByQuery, 500)

  /**
   * gets the last page
   * @returns {number}
   */
  get lastPage() {
    return Math.floor(Math.max(this.total - 1, 0) / (this.perPage || 1))
  }

  /**
   * Serializes the response body of a call to the WebServer
   * @param promise Any call of VUE RESOURCE
   * @returns {PromiseLike<Resp<this>>}
   */
  async call(promise: PromiseLike<HttpResponse>) {
    return await call(this, promise)
  }

  /**
   * Lists and Paginates the collection according to the config
   * @returns {Promise<this>}
   */
  async search() {
    const params = new Query(this.querySearch, this.currentPage, this.perPage, this.orderBy, this.asc)
    return await this.query(params)
  }

  /**
   * Changes the orderby
   * @returns {Promise<this>}
   */
  async setOrderBy(column: string) {
    if (this.orderBy === column) {
      this.asc = !this.asc
    } else {
      this.asc = true
    }
    this.orderBy = column
    this.currentPage = 0
    return await this.search()
  }

  /**
   * Changes the current page
   * @param val
   * @returns {Promise<this>}
   */
  async setCurrentPage(val: number) {
    this.currentPage = val
    return await this.search()
  }

  /**
   * Searches using query conditions
   * @param
   * @returns {Promise<this>}
   */
  async searchByQuery() {
    if (!this.querySearch || !this.querySearch.length || this.querySearch.length > 2) {
      this.currentPage = 0
      return await this.search()
    }
    return Promise.reject('Can\'t search at this condition')
  }

  /**
   * Moves to the previous page
   * @returns {Promise<this>}
   */
  async prevPage() {
    if (this.currentPage !== undefined && this.currentPage > 0) {
      this.currentPage--
      return await this.search()
    }
    return Promise.reject('First page')
  }

  /**
   * Moves to the next page
   * @returns {Promise<this>}
   */
  async nextPage() {
    if (this.currentPage !== undefined && this.currentPage < this.lastPage) {
      this.currentPage++
      return await this.search()
    }
    return Promise.reject('Last page')
  }
}

