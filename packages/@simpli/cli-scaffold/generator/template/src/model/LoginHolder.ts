import {Validator, IValidator, ValidationRequired} from '@/simpli'

export default class LoginHolder implements IValidator {
  @ValidationRequired()
  account?: string

  @ValidationRequired()
  password?: string

  async validate() {
    await Validator.toastValidator(this)
  }
}
