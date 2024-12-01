import { type ILogErrorRepository } from '../../data/protocols/log-error-repository'
import { type AccountModel } from '../../domain/models/account'
import { serverError, Ok } from '../../presentation/helpers/http/http-helper'
import { type IController, type HttpRequest, type HttpResponse } from '../../protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: IController
  LogErrorRepositoryStub: ILogErrorRepository
}
const makeFakeAccount = (): AccountModel => ({

  id: 'uuid-1',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'

})

const makeFakeRequest = (): HttpRequest => ({

  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    confirmPassword: 'any_password'
  }
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack_error'
  return serverError(fakeError)
}

const makeController = (): IController => {
  class ControllerStub implements IController {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise(resolve => { resolve(Ok(makeFakeAccount())) })
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async logError (stack: string): Promise<void> {
      await new Promise<void>(resolve => { resolve() })
    }
  }

  return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const LogErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, LogErrorRepositoryStub)

  return {
    controllerStub,
    sut,
    LogErrorRepositoryStub
  }
}

describe('Log Decorator ', () => {
  test('should be call handle if controller is called', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return the same value of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(Ok(makeFakeAccount()))
  })
  test('should call LogErrorRepository with correct error if controller return server error', async () => {
    const { sut, controllerStub, LogErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(LogErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(new Promise(resolve => { resolve(makeFakeServerError()) }))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack_error')
  })
})
