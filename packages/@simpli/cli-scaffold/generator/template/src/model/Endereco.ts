/**
 * Endereco
 * @author martinlabs CRUD generator
 */
import {ID, Resource, cep} from '@/simpli'
import {ValidationRequired} from '@/simpli'

export default class Endereco extends Resource {
  readonly $endpoint: string = '/Crud/Endereco{/id}'

  idEnderecoPk?: ID = 0

  get $id() {
    return this.idEnderecoPk
  }

  set $id(val: ID) {
    this.idEnderecoPk = val
  }

  @ValidationRequired()
  cep?: string = ''

  @ValidationRequired()
  zipcode?: string = ''

  @ValidationRequired()
  rua?: string = ''

  @ValidationRequired()
  nro?: string = ''

  @ValidationRequired()
  cidade?: string = ''

  @ValidationRequired()
  uf?: string = ''

  latitude?: number = 0

  longitude?: number = 0

  scheme() {
    return {
      idEnderecoPk: this.idEnderecoPk,
      cep: cep(this.cep),
      zipcode: this.zipcode,
      rua: this.rua,
      nro: this.nro,
      cidade: this.cidade,
      uf: this.uf,
      latitude: this.latitude,
      longitude: this.longitude,
    }
  }
}
