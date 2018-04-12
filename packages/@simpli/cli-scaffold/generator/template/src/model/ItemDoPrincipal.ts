/**
 * ItemDoPrincipal
 * @author martinlabs CRUD generator
 */
import {ID, TAG, Resource} from '@/simpli'
import {ValidationMaxLength, ValidationRequired} from '@/simpli'
import {ResponseSerialize} from '@/simpli'

import Principal from '@/model/Principal'

export default class ItemDoPrincipal extends Resource {
  readonly $endpoint: string = '/Crud/ItemDoPrincipal{/id}'

  idItemDoPrincipalPk?: ID = 0

  get $id() {
    return this.idItemDoPrincipalPk
  }

  set $id(val: ID) {
    this.idItemDoPrincipalPk = val
  }

  get $tag() {
    return this.titulo
  }

  set $tag(val: TAG) {
    this.titulo = val
  }

  @ValidationRequired()
  @ValidationMaxLength(31)
  titulo?: string = ''

  @ResponseSerialize(Principal)
  principal: Principal = new Principal()

  get idPrincipalFk() {
    return this.principal.idPrincipalPk || 0
  }

  set idPrincipalFk(idPrincipalFk: ID) {
    this.principal.idPrincipalPk = idPrincipalFk
  }

  scheme() {
    return {
      idItemDoPrincipalPk: this.idItemDoPrincipalPk,
      titulo: this.titulo,
      principal: this.principal.$id,
    }
  }
}
