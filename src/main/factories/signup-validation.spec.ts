import { makeSignupValidation } from './signup-validations'
import { ValidationComposite } from '../../presentation/helpers/validator/validation-composite'
import { type IValidation } from '../../presentation/helpers/validator/validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validator/required-field-validation'
import { CompareFieldsValidation } from '../../presentation/helpers/validator/compare-fields-validation'
import { type IEmailValidator } from '../../protocols/email-validator'
import { EmailValidation } from '../../presentation/helpers/validator/email-validation'

jest.mock('../../presentation/helpers/validator/validation-composite')

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
