/**
 * ForgotPasswordResp
 * @author martinlabs CRUD generator
 */
import {HttpBody} from '@/simpli'
import LoginHolder from '@/model/LoginHolder'

export default class ForgotPasswordResp extends HttpBody {
  async forgotPassword(model: LoginHolder) {
    return await this.POST('/Crud/ForgotPassword', model)
  }
}
