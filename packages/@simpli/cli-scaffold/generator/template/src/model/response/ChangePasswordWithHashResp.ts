/**
 * ForgotPasswordResp
 * @author martinlabs CRUD generator
 */
import {HttpBody} from '@/simpli'
import LoginHolder from '@/model/LoginHolder'

export default class ChangePasswordWithHashResp extends HttpBody {
  async changePasswordWithHash(model: LoginHolder) {
    return await this.POST('/Crud/ChangePasswordWithHash', model)
  }
}
