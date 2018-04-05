import {IValidator} from '@/types/app'
import Validator from '@/app/Validator'
import {ValidationRequired} from '@/helpers/validation.helper'

export default class LoginHolder implements IValidator {
  @ValidationRequired()
  account?: string

  @ValidationRequired()
  password?: string

  async validate() {
    await Validator.toastValidator(this)
  }
}
