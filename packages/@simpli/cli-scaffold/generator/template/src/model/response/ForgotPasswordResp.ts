/**
 * ForgotPasswordResp
 * @author martinlabs CRUD generator
 */
import HttpBody from '@/app/http/HttpBody'
import LoginHolder from '@/app/params/LoginHolder'

export default class ForgotPasswordResp extends HttpBody {
  async forgotPassword(model: LoginHolder) {
    return await this.POST('/Crud/ForgotPassword', model)
  }
}
