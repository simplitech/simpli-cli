/**
 * GrupoDoPrincipalResp
 * @author martinlabs CRUD generator
 */
import {Resource} from '@/app/http/Resource'
import GrupoDoPrincipal from '@/model/GrupoDoPrincipal'
import {ResponseSerialize} from '@/helpers/http.helper'
import {ID, TAG} from '@/types/app'

export default class GrupoDoPrincipalResp extends Resource {
  readonly $endpoint: string = '/Crud/GrupoDoPrincipal{/id}'

  @ResponseSerialize(GrupoDoPrincipal)
  grupoDoPrincipal: GrupoDoPrincipal = new GrupoDoPrincipal()

  get $id() {
    return this.grupoDoPrincipal.$id
  }

  set $id(val: ID) {
    this.grupoDoPrincipal.$id = val
  }

  get $tag() {
    return this.grupoDoPrincipal.$tag
  }

  set $tag(val: TAG) {
    this.grupoDoPrincipal.$tag = val
  }
}
