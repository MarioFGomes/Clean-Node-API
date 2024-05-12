import { EmailValidatorAdapter } from './email-validator-adapter'

describe('Email validator Adapter', () => {
  test('should return false if email is invalid', () => {
    const sut = new EmailValidatorAdapter()
    const valid = sut.isValid('Invalid_email@mail.com')
    expect(valid).toBe(false)
  })
})
