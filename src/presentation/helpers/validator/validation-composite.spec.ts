import { ValidationComposite } from './validation-composite'

describe('Validation Composite', () => {
  test('should return error if any validation fail', () => {
    const sut = new ValidationComposite([])
    const error = sut.validate({ field: 'any field' })
  })
})
