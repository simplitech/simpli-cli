/**
 * GrupoDoPrincipalResp
 * @author martinlabs CRUD generator
 */
import {ID, TAG, Resource} from '@/simpli'
import {ResponseSerialize} from '@/simpli'

import GrupoDoPrincipal from '@/model/GrupoDoPrincipal'

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
