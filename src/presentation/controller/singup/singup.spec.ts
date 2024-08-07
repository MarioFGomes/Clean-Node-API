import { type AccountModel } from '../../../domain/models/account'
import { type IAddAccountModel, type IAddAccount } from '../../../domain/usecases/add-account'
import { type HttpRequest, type IEmailValidator } from './singup-protocols'
import { ServerError, InvalidParamError, MissingParamError } from '../../errors'
import { SingUpController } from './singup'
import { Ok, BadRequest, serverError } from '../../helpers/http-helper'

function makeEmailValidator (): IEmailValidator {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeFakeAccount = (): AccountModel => ({

  id: 'uuid-1',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'

})

function makeAddAccount (): IAddAccount {
  class AddAccountStub implements IAddAccount {
    async add (account: IAddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }

  return new AddAccountStub()
}

interface SutTypes {
  sut: SingUpController
  emailValidatorStub: IEmailValidator
  addAccountStub: IAddAccount
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
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SingUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}
describe('SingUpController', () => {
  test('should return 400 if name is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(BadRequest(new MissingParamError('name')))
  })

  test('should return 400 if email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(BadRequest(new MissingParamError('email')))
  })

  test('should return 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        confirmPassword: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(BadRequest(new MissingParamError('password')))
  })

  test('should return 400 if confirm password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(BadRequest(new MissingParamError('confirmPassword')))
  })

  test('should return 400 if the email is not valid', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(BadRequest(new InvalidParamError('email')))
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const IsValidSub = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    await sut.handle(makeFakeRequest())
    expect(IsValidSub).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('should return 400 if confirm password is deferent of password', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        confirmPassword: 'any_password_confirm'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(BadRequest(new InvalidParamError('confirmPassword')))
  })

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

  test('should return 200 if AddAccount valid data is provider', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(Ok(makeFakeAccount()))
  })
})
