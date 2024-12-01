import { CompareFieldsValidation, RequiredFieldValidation, ValidationComposite, EmailValidation } from '../../../presentation/helpers/validator'
import { type IValidation } from '../../../protocols/validation'
import { type IEmailValidator } from '../../../protocols/email-validator'
import { makeSignupValidation } from './signup-validations'

jest.mock('../../../presentation/helpers/validator/validation-composite')

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignupValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignupValidation()
    const validation: IValidation[] = []
    for (const field of ['name', 'email', 'password', 'confirmPassword']) {
      validation.push(new RequiredFieldValidation(field))
    }
    validation.push(new CompareFieldsValidation('password', 'confirmPassword'))
    validation.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validation)
  })
})
