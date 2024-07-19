import { makeSignupValidation } from './signup-validations'
import { ValidationComposite } from '../../presentation/helpers/validator/validation-composite'
import { type IValidation } from '../../presentation/helpers/validator/validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validator/required-field-validation'

jest.mock('../../presentation/helpers/validator/validation-composite')

describe('SignupValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignupValidation()
    const validation: IValidation[] = []
    for (const field of ['name', 'email', 'password', 'confirmPassword']) {
      validation.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validation)
  })
})
