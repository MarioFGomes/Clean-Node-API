import { LoginController } from './login'
import { BadRequest, serverError } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors/MissingParam'
import { type HttpRequest, type IEmailValidator } from '../singup/singup-protocols'
import { InvalidParamError } from '../../errors'
import { type IAuthentication } from '../../../domain/usecases/authentication'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: IEmailValidator
  authenticationStub: IAuthentication
}

function makeEmailValidator (): IEmailValidator {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeFakerRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise(resolve => { resolve('any_token') })
    }
  }
  return new AuthenticationStub()
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)

  return {
    sut,
    emailValidatorStub,
    authenticationStub
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
    await sut.handle(makeFakerRequest())
    expect(IsValidSub).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakerRequest())
    expect(httpResponse).toEqual(BadRequest(new InvalidParamError('email')))
  })

  test('should return 500 if Email validator throw', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakerRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should call authenticator with correct email and password', async () => {
    const { sut, authenticationStub } = makeSut()
    const SpyAuth = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakerRequest())
    expect(SpyAuth).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
  })
})
