import { MissingParamError } from '../../errors'
import { type IValidation } from './validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
  validationStubs: IValidation[]
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('should return error if any validation fail', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('fieldID'))
    const error = sut.validate({ field: 'any field' })
    expect(error).toEqual(new MissingParamError('fieldID'))
  })

  test('should return error if any validation fail', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('fieldID'))
    const error = sut.validate({ field: 'any field' })
    expect(error).toEqual(new Error())
  })

  test('should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any field' })
    expect(error).toBeFalsy()
  })
})
