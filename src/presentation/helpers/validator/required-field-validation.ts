import { MissingParamError } from '../../errors'
import { type IValidation } from '../../../protocols/validation'

export class RequiredFieldValidation implements IValidation {
  constructor (private readonly FieldName: string) {}
  validate (input: any): Error | null {
    if (!input[this.FieldName]) {
      return new MissingParamError(this.FieldName)
    }
    return null
  }
}
