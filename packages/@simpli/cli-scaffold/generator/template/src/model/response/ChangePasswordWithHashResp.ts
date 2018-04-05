/**
 * ForgotPasswordResp
 * @author martinlabs CRUD generator
 */
import HttpBody from '@/app/http/HttpBody'
import LoginHolder from '@/app/params/LoginHolder'

export default class ChangePasswordWithHashResp extends HttpBody {
  async changePasswordWithHash(model: LoginHolder) {
    return await this.POST('/Crud/ChangePasswordWithHash', model)
  }
}
