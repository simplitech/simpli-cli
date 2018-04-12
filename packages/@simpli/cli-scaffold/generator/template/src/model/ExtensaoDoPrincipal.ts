/**
 * ExtensaoDoPrincipal
 * @author martinlabs CRUD generator
 */
import {ID, TAG, Resource} from '@/simpli'
import {ValidationMaxLength, ValidationRequired} from '@/simpli'
import {ResponseSerialize} from '@/simpli'

import Principal from '@/model/Principal'

export default class ExtensaoDoPrincipal extends Resource {
  readonly $endpoint: string = '/Crud/ExtensaoDoPrincipal{/id}'

  get $id() {
    return this.principal.$id
  }

  set $id(val: ID) {
    this.principal.$id = val
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
      titulo: this.titulo,
      principal: this.principal.$id,
    }
  }
}
