/**
 * UserResp
 * @author martinlabs CRUD generator
 */
import {ID, Resource} from '@/simpli'
import {ResponseSerialize} from '@/simpli'

import User from '@/model/User'

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
