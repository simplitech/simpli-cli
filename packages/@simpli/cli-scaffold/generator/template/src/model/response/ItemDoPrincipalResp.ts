/**
 * ItemDoPrincipalResp
 * @author martinlabs CRUD generator
 */
import {ID, TAG, Resource} from '@/simpli'
import {ResponseSerialize} from '@/simpli'

import ItemDoPrincipal from '@/model/ItemDoPrincipal'
import Principal from '@/model/Principal'

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
