import { CompareFieldsValidation } from '../../../presentation/helpers/validator/compare-fields-validation'
import { EmailValidation } from '../../../presentation/helpers/validator/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validator/required-field-validation'
import { type IValidation } from '../../../protocols/validation'
import { ValidationComposite } from '../../../presentation/helpers/validator/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignupValidation = (): ValidationComposite => {
  const validation: IValidation[] = []
  for (const field of ['name', 'email', 'password', 'confirmPassword']) {
    validation.push(new RequiredFieldValidation(field))
  }
  validation.push(new CompareFieldsValidation('password', 'confirmPassword'))
  validation.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validation)
}
