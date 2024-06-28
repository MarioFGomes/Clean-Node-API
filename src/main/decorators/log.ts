import { type HttpRequest, type HttpResponse, type IController } from '../../protocols'

export class LogControllerDecorator implements IController {
  constructor (private readonly _controller: IController) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this._controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      // log
    }
    return httpResponse
  }
}
