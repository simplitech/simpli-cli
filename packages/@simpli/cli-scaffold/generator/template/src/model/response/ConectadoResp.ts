/**
 * ConectadoResp
 * @author martinlabs CRUD generator
 */
import {Resource} from '@/app/http/Resource'
import Conectado from '@/model/Conectado'
import {ResponseSerialize} from '@/helpers/http.helper'
import {ID, TAG} from '@/types/app'

export default class ConectadoResp extends Resource {
  readonly $endpoint: string = '/Crud/Conectado{/id}'

  @ResponseSerialize(Conectado)
  conectado: Conectado = new Conectado()

  get $id() {
    return this.conectado.$id
  }

  set $id(val: ID) {
    this.conectado.$id = val
  }

  get $tag() {
    return this.conectado.$tag
  }

  set $tag(val: TAG) {
    this.conectado.$tag = val
  }
}
