/**
 * ExtensaoDoPrincipalResp
 * @author martinlabs CRUD generator
 */
import {Resource} from '@/app/http/Resource'
import ExtensaoDoPrincipal from '@/model/ExtensaoDoPrincipal'
import {ResponseSerialize} from '@/helpers/http.helper'
import Principal from '@/model/Principal'
import {ID, TAG} from '@/types/app'

export default class ExtensaoDoPrincipalResp extends Resource {
  readonly $endpoint: string = '/Crud/ExtensaoDoPrincipal{/id}'

  @ResponseSerialize(ExtensaoDoPrincipal)
  extensaoDoPrincipal: ExtensaoDoPrincipal = new ExtensaoDoPrincipal()

  @ResponseSerialize(Principal)
  allPrincipal: Principal[] = []

  get $id() {
    return this.extensaoDoPrincipal.$id
  }

  set $id(val: ID) {
    this.extensaoDoPrincipal.$id = val
  }

  get $tag() {
    return this.extensaoDoPrincipal.$tag
  }

  set $tag(val: TAG) {
    this.extensaoDoPrincipal.$tag = val
  }
}
