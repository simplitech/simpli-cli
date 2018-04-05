import {IValidator} from '@/types/app'
import {validate, ValidationError} from 'class-validator'
import {errorValidation} from '@/helpers/toast.helper'

export default class Validator implements IValidator {

  static async toastValidator(entity: object) {
    try {
      await new Validator(entity).validateFirstError()
    } catch (e) {
      errorValidation(e.message)
      throw e
    }
  }

  constructor(public entity?: object) {/**/}

  async validateFirstError() {
    const errors: ValidationError[] = await validate(this.entity || this)
    if (errors.length === 0) return
    const firstError = errors[0]
    const firstKey = Object.keys(firstError.constraints)[0]
    throw new Error(firstError.constraints[firstKey])
  }

  async validate() {
    await this.validateFirstError()
  }
}
