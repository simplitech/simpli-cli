/**
 * ItemDoPrincipal
 * @author martinlabs CRUD generator
 */
import {ID, TAG} from '@/types/app'
import {Resource} from '@/app/http/Resource'
import Principal from '@/model/Principal'
import {ValidationMaxLength, ValidationRequired} from '@/helpers/validation.helper'
import {ResponseSerialize} from '@/helpers/http.helper'

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
