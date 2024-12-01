import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validator'
import { type IValidation } from '../../../protocols/validation'
import { type IEmailValidator } from '../../../protocols/email-validator'
import { makeLoginValidation } from './login-validations'

jest.mock('../../../presentation/helpers/validator/validation-composite')

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validation: IValidation[] = []
    for (const field of ['email', 'password']) {
      validation.push(new RequiredFieldValidation(field))
    }
    validation.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validation)
  })
})
