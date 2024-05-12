import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const mockSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}
describe('Email validator Adapter', () => {
  test('should return false if email is invalid', () => {
    const sut = mockSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const IsValid = sut.isValid('Invalid_email@mail.com')
    expect(IsValid).toBe(false)
  })

  test('should return true if email is valid', () => {
    const sut = mockSut()
    const valid = sut.isValid('valid_email@mail.com')
    expect(valid).toBe(true)
  })

  test('should call validator with correct email', () => {
    const sut = mockSut()
    const IsEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any_email@mail.com')
    expect(IsEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
