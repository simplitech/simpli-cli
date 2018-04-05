/**
 * Conector Principal
 * @author martinlabs CRUD generator
 */
import {ID, TAG} from '@/types/app'
import {Resource} from '@/app/http/Resource'
import Principal from '@/model/Principal'
import Conectado from '@/model/Conectado'
import {ValidationMaxLength, ValidationRequired} from '@/helpers/validation.helper'
import {ResponseSerialize} from '@/helpers/http.helper'

export default class ConectorPrincipal extends Resource {
  readonly $endpoint: string = '/Crud/ConectorPrincipal{/id1}{/id2}'

  get $id() {
    return this.principal.$id
  }

  set $id(val: ID) {
    this.principal.$id = val
  }

  get $secondaryId() {
    return this.conectado.$id
  }

  set $secondaryId(val: ID) {
    this.conectado.$id = val
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

  @ResponseSerialize(Conectado)
  conectado: Conectado = new Conectado()

  get idPrincipalFk() {
    return this.principal.$id || 0
  }

  set idPrincipalFk(idPrincipalFk: ID) {
    this.principal.idPrincipalPk = idPrincipalFk
  }

  get idConectadoFk() {
    return this.conectado.$id || 0
  }

  set idConectadoFk(idConectadoFk: ID) {
    this.conectado.idConectadoPk = idConectadoFk
  }

  scheme() {
    return {
      titulo: this.titulo,
      principal: this.principal.$id,
      conectado: this.conectado.$id,
    }
  }
}
