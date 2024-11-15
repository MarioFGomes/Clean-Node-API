import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('FieldName', 'FieldToComparedName')
}
describe('', () => {
  test('should return MissingParamError if validation fail ', () => {
    const sut = makeSut()
    const error = sut.validate({
      FieldName: 'any_name',
      FieldToComparedName: 'wrong_name'
    })
    expect(error).toEqual(new InvalidParamError('FieldToComparedName'))
  })

  test('should not return if validation succeeds ', () => {
    const sut = makeSut()
    const error = sut.validate({
      FieldName: 'any_name',
      FieldToComparedName: 'any_name'
    })
    expect(error).toBeFalsy()
  })
})
