/**
 * Conectado
 * @author martinlabs CRUD generator
 */
import {ID, TAG} from '@/types/app'
import {Resource} from '@/app/http/Resource'
import {ValidationMaxLength, ValidationRequired} from '@/helpers/validation.helper'

export default class Conectado extends Resource {
  readonly $endpoint: string = '/Crud/Conectado{/id}'

  idConectadoPk?: ID = 0

  get $id() {
    return this.idConectadoPk
  }

  set $id(val: ID) {
    this.idConectadoPk = val
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
      idConectadoPk: this.idConectadoPk,
      titulo: this.titulo,
    }
  }
}