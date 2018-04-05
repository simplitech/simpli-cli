import {HttpResponse} from 'vue-resource'
import {Resp} from '@/types/app'
import {call, apiURL} from '@/helpers/http.helper'
import {IHttpBody} from '@/types/app'
import {clone} from '@/helpers/misc.helper'
import {http} from '@/helpers/prototypes.helper'

export default class HttpBody implements IHttpBody {
  private cls?: any

  constructor(cls?: any) {
    if (cls) this.cls = cls
    else delete this.cls
  }

  /**
   * Serializes the response body of a call to the WebServer
   * @param promise Any call of VUE RESOURCE
   * @returns {PromiseLike<Resp<this>>}
   */
  async call(promise: PromiseLike<HttpResponse>) {
    if (this.cls) return await call(this.cls, promise)
    return await call(this, promise)
  }

  /**
   * Serializes the response body of GET method to the WebServer
   * @param uri URI endpoint
   * @param endpoint
   * @returns {Promise<Resp<this>>}
   */
  async GET(uri: string, endpoint: boolean = true) {
    return this.call(http.get(endpoint ? apiURL(uri) : uri))
  }

  /**
   * Serializes the response body of POST method to the WebServer
   * @param uri URI endpoint
   * @param body payload
   * @param endpoint
   * @returns {Promise<Resp<this>>}
   */
  async POST(uri: string, body?: any, endpoint: boolean = true) {
    return this.call(http.post(endpoint ? apiURL(uri) : uri, body))
  }

  /**
   * Serializes the response body of PUT method to the WebServer
   * @param uri URI endpoint
   * @param body payload
   * @param endpoint
   * @returns {Promise<Resp<this>>}
   */
  async PUT(uri: string, body?: any, endpoint: boolean = true) {
    return this.call(http.put(endpoint ? apiURL(uri) : uri, body))
  }

  /**
   * Serializes the response body of DELETE method to the WebServer
   * @param uri URI endpoint
   * @param endpoint
   * @returns {Promise<Resp<this>>}
   */
  async DELETE(uri: string, endpoint: boolean = true) {
    return this.call(http.delete(endpoint ? apiURL(uri) : uri))
  }

  /**
   * Clone a given entity
   * @param entity
   */
  clone(entity: any) {
    clone(this, entity)
  }
}

