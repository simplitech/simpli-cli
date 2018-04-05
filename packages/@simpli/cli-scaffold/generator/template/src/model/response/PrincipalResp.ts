/**
 * PrincipalResp
 * @author martinlabs CRUD generator
 */
import Principal from '@/model/Principal'
import {Resource} from '@/app/http/Resource'
import Tag from '@/model/Tag'
import GrupoDoPrincipal from '@/model/GrupoDoPrincipal'
import {ResponseSerialize} from '@/helpers/http.helper'
import {ID, TAG} from '@/types/app'

export default class PrincipalResp extends Resource {
  readonly $endpoint: string = '/Crud/Principal{/id}'

  @ResponseSerialize(Principal)
  principal: Principal = new Principal()

  @ResponseSerialize(GrupoDoPrincipal)
  allGrupoDoPrincipal: GrupoDoPrincipal[] = []

  @ResponseSerialize(Tag)
  allTag: Tag[] = []

  get $id() {
    return this.principal.$id
  }

  set $id(val: ID) {
    this.principal.$id = val
  }

  get $tag() {
    return this.principal.$tag
  }

  set $tag(val: TAG) {
    this.principal.$tag = val
  }
}
