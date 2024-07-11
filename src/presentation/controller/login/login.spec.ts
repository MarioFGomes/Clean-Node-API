import { LoginController } from './login'
import { BadRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors/MissingParam'
import { type IEmailValidator } from '../singup/singup-protocols'
import { InvalidParamError } from '../../errors'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: IEmailValidator
}

function makeEmailValidator (): IEmailValidator {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}
describe('Login Controller', () => {
  test('should return 400 if email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('email')))
  })

  test('should return 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('password')))
  })

  test('should call email validator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const IsValidSub = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(IsValidSub).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const IsValidSub = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        email: 'any_email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new InvalidParamError('email')))
  })
})
