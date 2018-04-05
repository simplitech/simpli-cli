/**
 * EnderecoResp
 * @author martinlabs CRUD generator
 */
import {Resource} from '@/app/http/Resource'
import Endereco from '@/model/Endereco'
import {ResponseSerialize} from '@/helpers/http.helper'
import {ID} from '@/types/app'

export default class EnderecoResp extends Resource {
  readonly $endpoint: string = '/Crud/Endereco{/id}'

  @ResponseSerialize(Endereco)
  endereco: Endereco = new Endereco()

  get $id() {
    return this.endereco.$id
  }

  set $id(val: ID) {
    this.endereco.$id = val
  }
}
