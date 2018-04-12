/**
 * User
 * @author martinlabs CRUD generator
 */
import {ID, TAG, Resource} from '@/simpli'
import {ValidationMaxLength, ValidationRequired} from '@/simpli'

export default class GrupoDoPrincipal extends Resource {
  readonly $endpoint: string = '/Crud/GrupoDoPrincipal{/id}'

  idGrupoDoPrincipalPk?: ID = 0

  get $id() {
    return this.idGrupoDoPrincipalPk
  }

  set $id(val: ID) {
    this.idGrupoDoPrincipalPk = val
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

  scheme() {
    return {
      idGrupoDoPrincipalPk: this.idGrupoDoPrincipalPk,
      titulo: this.titulo,
    }
  }
}
