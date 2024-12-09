import { type HttpRequest, type HttpResponse, type IController } from '../../protocols'
import { type ILogErrorRepository } from '../../data/protocols/db/log-error-repository'

export class LogControllerDecorator implements IController {
  constructor (private readonly _controller: IController,
    private readonly logErrorRepository: ILogErrorRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this._controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
