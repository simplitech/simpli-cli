/**
 * ItemDoPrincipalResp
 * @author martinlabs CRUD generator
 */
import {Resource} from '@/app/http/Resource'
import ItemDoPrincipal from '@/model/ItemDoPrincipal'
import {ResponseSerialize} from '@/helpers/http.helper'
import Principal from '@/model/Principal'
import {ID, TAG} from '@/types/app'

export default class ItemDoPrincipalResp extends Resource {
  readonly $endpoint: string = '/Crud/ItemDoPrincipal{/id}'

  @ResponseSerialize(ItemDoPrincipal)
  itemDoPrincipal: ItemDoPrincipal = new ItemDoPrincipal()

  @ResponseSerialize(Principal)
  allPrincipal: Principal[] = []

  get $id() {
    return this.itemDoPrincipal.$id
  }

  set $id(val: ID) {
    this.itemDoPrincipal.$id = val
  }

  get $tag() {
    return this.itemDoPrincipal.$tag
  }

  set $tag(val: TAG) {
    this.itemDoPrincipal.$tag = val
  }
}
