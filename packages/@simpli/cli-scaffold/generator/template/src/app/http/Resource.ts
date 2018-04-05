import {ID, IResource, IValidator, TAG} from '@/types/app'
import {Resp} from '@/types/app'
import {apiURL} from '@/helpers/http.helper'
import {resource} from '@/helpers/prototypes.helper'
import HttpBody from '@/app/http/HttpBody'
import Validator from '@/app/Validator'

export abstract class Resource extends HttpBody implements IResource, IValidator {
  /**
   * Name of entity
   */
  readonly $name: string = this.constructor.name

  /**
   * API URI endpoint
   */
  readonly abstract $endpoint: string

  /**
   * ID of entity
   */
  abstract get $id()
  abstract set $id(val: ID)

  /**
   * Tag of entity
   */
  get $tag() { return undefined }
  set $tag(val: TAG) {/**/}

  /**
   * Finds and return a entity from WebServer
   * @param id entity ID
   * @returns {Promise<Resp<this>>}
   */
  async find(id: ID) {
    return await this.call(resource(apiURL(this.$endpoint)).get({id}))
  }

  /**
   * Finds and return a entity from WebServer by query
   * @param query
   * @returns {Promise<Resp<this>>}
   */
  async findByQuery(query: any) {
    return await this.call(resource(apiURL(this.$endpoint)).get(query))
  }

  /**
   * Saves this entity and post it into WebServer
   * @param http Server response
   * @returns {Promise<Resp<HttpBody>>}
   */
  async save(http: HttpBody = new HttpBody(Number)) {
    return await http.call(resource(apiURL(this.$endpoint)).save(this))
  }

  /**
   * Updates this entity and post it into WebServer
   * @param http Server response
   * @returns {Promise<Resp<HttpBody>>}
   */
  async update(http: HttpBody = new HttpBody(Number)) {
    return await http.call(resource(apiURL(this.$endpoint)).update(this))
  }

  /**
   * Removes a entity from WebServer
   * @param http Server response
   * @returns {Promise<Resp<HttpBody>>}
   */
  async remove(http: HttpBody = new HttpBody(Number)) {
    return await http.call(resource(apiURL(this.$endpoint)).remove({id: this.$id}))
  }

  /**
   * Normalizes what will be showed as entity or list
   * @returns {object}
   */
  scheme() {
    const json = JSON.stringify(this)
    const data = JSON.parse(json)
    delete data.$endpoint
    delete data.$name
    return data
  }

  /**
   * Normalizes what will be showed as entity or list when a CSV is generated
   * @returns {object}
   */
  csvScheme() {
    return this.scheme()
  }

  /**
   * Validates resource. Shows toast if there are errors and interrupts the code
   * @returns {Promise<void>}
   */
  async validate() {
    await Validator.toastValidator(this)
  }

  /**
   * Validate and save
   * @returns {Promise<void>}
   */
  async validateAndSave() {
    await this.validate()
    return await this.save()
  }

  /**
   * Validate and update
   * @returns {Promise<void>}
   */
  async validateAndUpdate() {
    await this.validate()
    return await this.update()
  }
}
