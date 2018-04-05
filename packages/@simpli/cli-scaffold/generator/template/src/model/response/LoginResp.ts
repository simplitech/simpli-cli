/**
 * LoginResp
 * @author martinlabs CRUD generator
 */
import {ID} from '@/types/app'
import HttpBody from '@/app/http/HttpBody'
import User from '@/model/User'
import LoginHolder from '@/app/params/LoginHolder'
import {encrypt} from '@/helpers'

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
