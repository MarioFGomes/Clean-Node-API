import { ServerError, MissingParamError,EmailInUseError } from '../../errors'
import { SingUpController } from './singup-controller'
import { Ok, BadRequest, serverError, Forbidden } from '../../helpers/http/http-helper'
import { AuthenticationModel, IAuthentication } from './singup-controller-protocols'
import { type AccountModel } from '../../../domain/models/account'
import { type IAddAccountModel, type IAddAccount } from '../../../domain/usecases/add-account'
import { type HttpRequest, type IValidation } from './singup-controller-protocols'
const makeFakeAccount = (): AccountModel => ({

  id: 'uuid-1',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'

})

const makeFakerRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth ({ email, password }: AuthenticationModel): Promise<string | null> {
      return await new Promise(resolve => { resolve('any_token') })
    }
  }
  return new AuthenticationStub()
}

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add (account: IAddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }

  return new AddAccountStub()
}

const makeFakeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

interface SutTypes {
  sut: SingUpController
  addAccountStub: IAddAccount
  validationStub: IValidation
  authenticationStub: IAuthentication
}

const makeFakeRequest = (): HttpRequest => ({

  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    confirmPassword: 'any_password'
  }
})

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeFakeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new SingUpController(addAccountStub, validationStub,authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}
describe('SingUpController', () => {
  test('should return 500 if AddAccount is throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(200)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'

    })
  })

  test('should return 403 if AddAccount return null', async () => {
    const { sut,addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(Forbidden(new EmailInUseError()))
  })

  test('should return 200 if AddAccount valid data is provider', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(Ok({AccessToken:'any_token'}))
  })

  test('should call validator with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if validation fails ', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_error'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('any_error')))
  })

  test('should call authenticator with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const SpyAuth = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakerRequest())
    expect(SpyAuth).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

    test('should return 500 if Authenticator throw', async () => {
      const { sut, authenticationStub } = makeSut()
      jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
      const httpResponse = await sut.handle(makeFakerRequest())
      expect(httpResponse).toEqual(serverError(new Error()))
    })
})
