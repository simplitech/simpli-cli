/**
 * EnderecoResp
 * @author martinlabs CRUD generator
 */
import {ID, Resource} from '@/simpli'
import {ResponseSerialize} from '@/simpli'

import Endereco from '@/model/Endereco'

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
