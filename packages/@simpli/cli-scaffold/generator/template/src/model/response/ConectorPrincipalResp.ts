/**
 * ConectorPrincipalResp
 * @author martinlabs CRUD generator
 */
import {Resource} from '@/app/http/Resource'
import ConectorPrincipal from '@/model/ConectorPrincipal'
import {ResponseSerialize} from '@/helpers/http.helper'
import Principal from '@/model/Principal'
import Conectado from '@/model/Conectado'
import {ID, TAG} from '@/types/app'

export default class ConectorPrincipalResp extends Resource {
  readonly $endpoint: string = '/Crud/ConectorPrincipal{/id1}{/id2}'

  @ResponseSerialize(ConectorPrincipal)
  conectorPrincipal: ConectorPrincipal = new ConectorPrincipal()

  @ResponseSerialize(Principal)
  allPrincipal: Principal[] = []

  @ResponseSerialize(Conectado)
  allConectado: Conectado[] = []

  get $id() {
    return this.conectorPrincipal.$id
  }

  set $id(val: ID) {
    this.conectorPrincipal.$id = val
  }

  get $tag() {
    return this.conectorPrincipal.$tag
  }

  set $tag(val: TAG) {
    this.conectorPrincipal.$tag = val
  }
}
