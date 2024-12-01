import { type IEmailValidator } from '../../../protocols/email-validator'
import { InvalidParamError } from '../../errors'
import { type IValidation } from '../../../protocols/validation'

export class EmailValidation implements IValidation {
  constructor (private readonly FieldName: string, private readonly emailValidator: IEmailValidator) {}
  validate (input: any): Error | null {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const IsValidEmail = this.emailValidator.isValid(input[this.FieldName])

    if (!IsValidEmail) return new InvalidParamError(this.FieldName)
    return null
  }
}
