/**
 * User
 * @author martinlabs CRUD generator
 */
import {ID} from '@/types/app'
import {Resource} from '@/app/http/Resource'
import {ValidationEmail, ValidationPasswordLength, ValidationRequired} from '@/helpers/validation.helper'
import {ResponseFill, ResponseHidden} from '@/helpers/http.helper'

export default class User extends Resource {
  readonly $endpoint: string = '/Crud/User{/id}'

  idUserPk?: ID = 0

  get $id() {
    return this.idUserPk
  }

  set $id(val: ID) {
    this.idUserPk = val
  }

  @ValidationRequired()
  @ValidationEmail()
  email?: string = ''

  @ResponseHidden()
  @ValidationRequired()
  @ValidationPasswordLength(6, 31)
  senha?: string = ''

  scheme() {
    return {
      idUserPk: this.idUserPk,
      email: this.email,
    }
  }
}
