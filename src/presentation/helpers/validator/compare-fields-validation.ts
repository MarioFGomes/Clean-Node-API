import { InvalidParamError } from '../../errors'
import { type IValidation } from '../../../protocols/validation'

export class CompareFieldsValidation implements IValidation {
  constructor (private readonly FieldName: string, private readonly FieldToComparedName: string) {}
  validate (input: any): Error | null {
    if (input[this.FieldName] !== input[this.FieldToComparedName]) {
      return new InvalidParamError(this.FieldToComparedName)
    }
    return null
  }
}
