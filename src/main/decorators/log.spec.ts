import { type IController, type HttpRequest, type HttpResponse } from '../../protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: IController
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

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)

  return {
    controllerStub,
    sut
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
})
