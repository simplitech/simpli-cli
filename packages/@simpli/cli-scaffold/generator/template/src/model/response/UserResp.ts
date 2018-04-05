/**
 * UserResp
 * @author martinlabs CRUD generator
 */
import {Resource} from '@/app/http/Resource'
import User from '@/model/User'
import {ResponseSerialize} from '@/helpers/http.helper'
import {ID} from '@/types/app'

export default class UserResp extends Resource {
  readonly $endpoint: string = '/Crud/User{/id}'

  @ResponseSerialize(User)
  user: User = new User()

  get $id() {
    return this.user.$id
  }

  set $id(val: ID) {
    this.user.$id = val
  }
}
