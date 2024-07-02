import { type ILogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import { type IController, type HttpRequest, type HttpResponse } from '../../protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: IController
  LogErrorRepositoryStub: ILogErrorRepository
}

const makeController = (): IController => {
  class ControllerStub implements IController {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const response: HttpResponse = {
        body: { name: 'Mario Gomes' },
        statusCode: 200
      }
      return await new Promise(resolve => { resolve(response) })
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async log (stack: string): Promise<void> {
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

    const httpRequest: HttpRequest = {
      body: {
        id: 'Valid_Id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }

    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the same value of the controller', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        id: 'Valid_Id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      body: { name: 'Mario Gomes' },
      statusCode: 200
    })
  })
  test('should call LogErrorRepository with correct error if controller return server error', async () => {
    const { sut, controllerStub, LogErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack_error'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(LogErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(new Promise(resolve => { resolve(error) }))

    const httpRequest: HttpRequest = {
      body: {
        id: 'Valid_Id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }

    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack_error')
  })
})
