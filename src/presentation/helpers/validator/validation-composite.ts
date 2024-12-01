import { type IValidation } from '../../../protocols/validation'

export class ValidationComposite implements IValidation {
  constructor (private readonly validations: IValidation[]) {}
  validate (input: any): Error | null {
    for (const validator of this.validations) {
      const error = validator.validate(input)
      if (error) return error
    }
    return null
  }
}
