import { CompareFieldsValidation } from '../../presentation/helpers/validator/compare-fields-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validator/required-field-validation'
import { type IValidation } from '../../presentation/helpers/validator/validation'
import { ValidationComposite } from '../../presentation/helpers/validator/validation-composite'

export const makeSignupValidation = (): ValidationComposite => {
  const validation: IValidation[] = []
  for (const field of ['name', 'email', 'password', 'confirmPassword']) {
    validation.push(new RequiredFieldValidation(field))
  }
  validation.push(new CompareFieldsValidation('password', 'confirmPassword'))
  return new ValidationComposite(validation)
}
