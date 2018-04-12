/**
 * LoginResp
 * @author martinlabs CRUD generator
 */
import {ID, encrypt} from '@/simpli'
import {HttpBody} from '@/simpli'

import User from '@/model/User'
import LoginHolder from '@/model/LoginHolder'

export default class LoginResp extends HttpBody {
  id?: ID = 0
  token?: string = ''
  user: User = new User()

  async auth() {
    return await this.GET('/Crud/Auth')
  }

  async signIn(model: LoginHolder) {
    return await this.POST('/Crud/SignIn', {
      account: model.account,
      password: encrypt(model.password || ''),
    })
  }
}
